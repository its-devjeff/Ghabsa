#!/usr/bin/env bash
# =============================================================================
# Ghabsa - issue the Let's Encrypt certificate for DOMAIN + www.DOMAIN and switch Nginx to HTTPS.
# Run FROM YOUR MACHINE, once both names resolve to the server:
#
#   bash scripts/local/setup-tls.sh
#
# Certbot HTTP-01 over the webroot the HTTP site already serves (/.well-known/acme-challenge/), so
# it needs no registrar or DNS-API access. Requires DOMAIN + LETSENCRYPT_EMAIL in .deploy.env.
# Safe to re-run: --keep-until-expiring makes an existing valid cert a no-op.
# =============================================================================
set -euo pipefail
source "$(dirname "$0")/../lib/common.sh"
: "${LETSENCRYPT_EMAIL:?set LETSENCRYPT_EMAIL in scripts/.deploy.env}"

preflight

# 1. DNS gate - HARD fail. Let's Encrypt rate-limits failed validations (5/hour per name), so a
#    doomed attempt costs real time. dig first; python3 fallback (macOS has no getent).
resolve_a() {
  if command -v dig >/dev/null 2>&1; then
    dig +short "$1" A 2>/dev/null | grep -E '^[0-9]+(\.[0-9]+){3}$' | head -1
  else
    python3 -c "import socket,sys
try: print(socket.gethostbyname(sys.argv[1]))
except OSError: pass" "$1" 2>/dev/null
  fi
}
if echo "$SERVER_HOST" | grep -qE '^[0-9]+(\.[0-9]+){3}$'; then SERVER_IP="$SERVER_HOST"; else SERVER_IP="$(resolve_a "$SERVER_HOST")"; fi
for name in "$DOMAIN" "www.$DOMAIN"; do
  got="$(resolve_a "$name" || true)"
  [ "$got" = "$SERVER_IP" ] || die "$name resolves to '${got:-nothing}', not $SERVER_IP - fix DNS first."
  log "   DNS OK: $name -> $got"
done

# 2. Issue (or keep) one lineage named for the apex, covering both names.
log "==> Requesting certificate (Certbot HTTP-01, webroot)..."
ssh_cmd "sudo mkdir -p /var/www/certbot && sudo certbot certonly --webroot -w /var/www/certbot \
  --cert-name $DOMAIN -d $DOMAIN -d www.$DOMAIN \
  --email $LETSENCRYPT_EMAIL --agree-tos --no-eff-email --non-interactive --keep-until-expiring"

# 3. Renewal reload hook. `certonly --webroot` never touches Nginx, so without a deploy hook a
#    renewal succeeds while Nginx keeps serving the old cert from memory. The hook is generic
#    (`nginx -t && reload`, covering every lineage on the server), so install it only if missing.
ssh_cmd "test -x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh || { \
  sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy && \
  printf '%s\n' '#!/bin/sh' 'nginx -t && systemctl reload nginx' | sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh >/dev/null && \
  sudo chmod 0755 /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh && echo '   installed renewal reload hook'; }"

# 4. Mark TLS active and swap in the TLS site (fail-closed). On failure, unmark so the next deploy
#    keeps shipping the (still-live) HTTP variant.
log "==> Switching Nginx to the TLS variant..."
ssh_cmd "echo -n $DOMAIN | sudo tee /etc/nginx/.ghabsa-tls-domain >/dev/null && sudo touch $TLS_MARKER"
if ! sync_nginx; then
  ssh_cmd "sudo rm -f $TLS_MARKER"
  die "TLS Nginx config rejected - HTTP site restored, TLS marker removed."
fi

# 5. Prove unattended renewal works (a timer existing is not a renewal succeeding).
log "==> Verifying renewal (certbot renew --dry-run)..."
# --no-random-sleep-on-renew: without a TTY certbot otherwise waits a random 0-8 minutes first.
if ssh_cmd "sudo certbot renew --dry-run --no-random-sleep-on-renew --cert-name $DOMAIN 2>&1 | tail -3"; then
  log "   Renewal dry-run PASSED."
else
  log "   WARNING: renewal dry-run failed - the cert is live but will NOT auto-renew. Investigate."
fi

log "==> TLS active: https://$DOMAIN/ (www and http both 301 there)."
