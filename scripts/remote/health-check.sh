#!/usr/bin/env bash
# =============================================================================
# Ghabsa - end-to-end health check. Runs ON THE SERVER (the deploy runs it over ssh):
#   bash /opt/ghabsa/production/scripts/remote/health-check.sh [domain]
#
# Walks the stack bottom-up so the first FAIL names the broken layer:
#   unit -> config -> socket -> app (direct) -> MongoDB -> Nginx edge -> upload store -> resources
# Exit 0 = healthy, 1 = at least one FAIL. WARNs never fail the run - the deploy gates on this.
# =============================================================================
set -uo pipefail

APP_ROOT="/opt/ghabsa/production"
DOMAIN="${1:-$(cat "$APP_ROOT/.domain" 2>/dev/null || echo ghabsa.com)}"
SOCK="/run/ghabsa/api.sock"
CODE="$APP_ROOT/api/ghabsa-api"
DATA="$APP_ROOT/data/ghabsa-api"
ENV_FILE="/etc/ghabsa/ghabsa-api.env"
UPLOAD_DIRS="uploads Dinner trendyPhoto adverts profile"

PASS=0; FAIL=0; WARN=0
G='\033[0;32m'; R='\033[0;31m'; Y='\033[0;33m'; N='\033[0m'
ok()   { PASS=$((PASS+1)); printf "  ${G}OK${N}   %s\n" "$*"; }
bad()  { FAIL=$((FAIL+1)); printf "  ${R}FAIL${N} %s\n" "$*"; }
warn() { WARN=$((WARN+1)); printf "  ${Y}WARN${N} %s\n" "$*"; }
sec()  { echo; echo "── $* ─────────────────────────────────────────"; }

# The socket dir is 0750 ghabsa:ghabsa, so the deploy user reaches the app through sudo.
app()  { sudo -n curl -s -o /dev/null -w '%{http_code}' --max-time 5 --unix-socket "$SOCK" "http://localhost$1" 2>/dev/null || echo ERR; }

# Hit Nginx exactly as a browser would for $DOMAIN, but pinned to loopback so DNS can't interfere.
if [ -f /etc/nginx/.ghabsa-tls-active ]; then
  TLS=true;  BASE="https://$DOMAIN"; PIN=(--resolve "$DOMAIN:443:127.0.0.1")
else
  TLS=false; BASE="http://$DOMAIN";  PIN=(--resolve "$DOMAIN:80:127.0.0.1")
fi
edge() { curl -s -o /dev/null -w '%{http_code}' --max-time 10 "${PIN[@]}" "$@" 2>/dev/null || echo ERR; }

sec "SYSTEMD"
for u in ghabsa-api nginx; do
  st="$(systemctl is-active "$u" 2>/dev/null || true)"
  [ "$st" = "active" ] && ok "$u active" || bad "$u - ${st:-unknown}"
done
restarts="$(systemctl show ghabsa-api -p NRestarts --value 2>/dev/null || echo 0)"
[ "${restarts:-0}" -le 3 ] && ok "ghabsa-api restarts since last start: ${restarts:-0}" \
  || warn "ghabsa-api has auto-restarted ${restarts}x - crash loop? (logs.sh api)"

sec "CONFIG"
if sudo -n test -f "$ENV_FILE"; then
  ok "$ENV_FILE present"
  sudo -n grep -qE "^DATABASE_URL=[\"']?mongodb(\\+srv)?://" "$ENV_FILE" && ok "DATABASE_URL set" \
    || bad "DATABASE_URL missing or placeholder in $ENV_FILE"
  sudo -n grep -qE '^JWT=.{32,}' "$ENV_FILE" && ok "JWT secret set" || bad "JWT secret missing/short"
  sudo -n grep -qE '^MAIL_PASS=.+' "$ENV_FILE" && ok "MAIL_PASS set (contact form on)" \
    || warn "MAIL_PASS empty - contact form answers 503 until a Gmail App Password is set"
else
  bad "$ENV_FILE missing - run scripts/local/deploy.sh --config-only"
fi

sec "APP (direct, over the Unix socket)"
if sudo -n test -S "$SOCK"; then ok "socket bound: $SOCK"; else bad "socket missing: $SOCK (app down, or still waiting on MongoDB)"; fi
# The API must only be reachable through the socket; a TCP listener means PORT was overridden.
tcp="$(sudo -n ss -tlnpH 2>/dev/null | grep '"node"' | awk '{print $4}' | tr '\n' ' ')"
[ -z "$tcp" ] && ok "no TCP listener for node (socket only)" || warn "node is also listening on TCP: $tcp"
c="$(app /healthz)"; [ "$c" = "200" ] && ok "/healthz -> 200" || bad "/healthz -> $c"
# 200 = MongoDB connected; 503 = app up but the database connection dropped.
c="$(app /readyz)"
case "$c" in
  200) ok "/readyz -> 200 (MongoDB connected)" ;;
  503) bad "/readyz -> 503 (MongoDB disconnected - Atlas down, or Network Access changed?)" ;;
  *)   bad "/readyz -> $c" ;;
esac
c="$(app /api/post/listPosts)"; [ "$c" = "200" ] && ok "GET /api/post/listPosts -> 200 (real DB query)" || bad "GET /api/post/listPosts -> $c"

sec "EDGE (Nginx, as a browser sees $BASE)"
c="$(edge "$BASE/")";                   [ "$c" = "200" ] && ok "/ -> 200 (SPA shell)"            || bad "/ -> $c"
c="$(edge "$BASE/Library")";            [ "$c" = "200" ] && ok "/Library -> 200 (SPA deep link)" || bad "/Library -> $c (try_files fallback broken?)"
c="$(edge "$BASE/readyz")";             [ "$c" = "200" ] && ok "/readyz -> 200 via Nginx"         || bad "/readyz via Nginx -> $c (502 = Nginx cannot reach the socket)"
c="$(edge "$BASE/api/post/listPosts")"; [ "$c" = "200" ] && ok "/api/post/listPosts -> 200"      || bad "/api/post/listPosts via Nginx -> $c"
# A real hashed bundle, and proof it is served pre-compressed.
bundle="$(curl -s --max-time 10 "${PIN[@]}" "$BASE/" 2>/dev/null | grep -oE '/static/js/main\.[0-9a-f]+\.js' | head -1)"
if [ -n "$bundle" ]; then
  enc="$(curl -s -o /dev/null -D - --max-time 10 "${PIN[@]}" -H 'Accept-Encoding: gzip' "$BASE$bundle" 2>/dev/null | tr -d '\r' | awk -F': ' 'tolower($1)=="content-encoding"{print $2}')"
  [ "$enc" = "gzip" ] && ok "$bundle served gzip" || warn "$bundle served without gzip (gzip_static / .gz files?)"
else
  bad "no /static/js/main.*.js referenced by index.html - SPA not deployed?"
fi
sample="$(sudo -n find "$DATA/Dinner" -maxdepth 1 -type f -name '*.jp*g' 2>/dev/null | head -1)"
if [ -n "$sample" ]; then
  rel="/Dinner/$(basename "$sample" | sed 's/ /%20/g')"
  c="$(edge "$BASE$rel")"; [ "$c" = "200" ] && ok "upload store via Nginx ($rel) -> 200" || bad "upload store via Nginx ($rel) -> $c"
fi
if $TLS; then
  c="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 --resolve "$DOMAIN:80:127.0.0.1" "http://$DOMAIN/" 2>/dev/null || echo ERR)"
  [ "$c" = "301" ] && ok "http:// -> 301 to https" || warn "http:// -> $c (expected 301)"
fi

sec "UPLOAD STORE"
for d in $UPLOAD_DIRS; do
  if [ -L "$CODE/$d" ] && [ "$(readlink "$CODE/$d")" = "$DATA/$d" ]; then
    sudo -n -u ghabsa test -w "$DATA/$d" && ok "$d -> store, writable by ghabsa" || bad "$d: store not writable by ghabsa"
  else
    bad "$CODE/$d is not a symlink into $DATA (uploads would be lost on deploy)"
  fi
done

sec "RESOURCES"
mem="$(systemctl show ghabsa-api -p MemoryCurrent --value 2>/dev/null)"
if [ -n "$mem" ] && [ "$mem" != "[not set]" ] && [ "$mem" -gt 0 ] 2>/dev/null; then
  mb=$(( mem / 1048576 ))
  [ "$mb" -lt 450 ] && ok "ghabsa-api memory ${mb}MB (MemoryHigh 512M)" || warn "ghabsa-api memory ${mb}MB - near MemoryHigh 512M"
fi
[ -n "$(swapon --show --noheadings 2>/dev/null)" ] && ok "swap active" || warn "no swap active"
avail="$(free -m | awk '/^Mem:/{print $7}')"
[ "${avail:-0}" -ge 400 ] && ok "memory available ${avail}MB" || warn "memory available only ${avail}MB"
used="$(df / | tail -1 | awk '{print $5}' | tr -d '%')"
if   [ "${used:-100}" -lt 80 ]; then ok "root disk ${used}% used"
elif [ "${used:-100}" -lt 90 ]; then warn "root disk ${used}% used"
else bad "root disk ${used}% used - CRITICAL"; fi
ok "upload store size $(sudo -n du -sh "$DATA" 2>/dev/null | awk '{print $1}')"

sec "TLS"
if $TLS; then
  end="$(echo | timeout 5 openssl s_client -connect 127.0.0.1:443 -servername "$DOMAIN" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)"
  if [ -n "$end" ]; then
    left=$(( ( $(date -d "$end" +%s) - $(date +%s) ) / 86400 ))
    [ "$left" -gt 14 ] && ok "certificate for $DOMAIN expires in ${left}d" || warn "certificate expires in ${left}d - renewal failing?"
  else
    bad "could not read the certificate served for $DOMAIN"
  fi
else
  warn "HTTP-only (run scripts/local/setup-tls.sh)"
fi

echo
echo "════════════════════════════════════════════════════"
printf "  PASS: ${G}%d${N}   FAIL: ${R}%d${N}   WARN: ${Y}%d${N}\n" "$PASS" "$FAIL" "$WARN"
echo "════════════════════════════════════════════════════"
[ "$FAIL" -eq 0 ] && { echo "  RESULT: HEALTHY"; exit 0; } || { echo "  RESULT: UNHEALTHY ($FAIL failed)"; exit 1; }
