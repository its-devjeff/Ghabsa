#!/usr/bin/env bash
# =============================================================================
# Ghabsa deploy - shared helpers. SOURCED by scripts/local/*.sh, never run directly.
#
# Loads scripts/.deploy.env (the operator-local target), defines the server-side path standard,
# and the ssh/rsync/Nginx helpers every local script uses. Written for macOS's stock bash 3.2 and
# openrsync, since that is where these scripts run.
#
# Everything here is namespaced `ghabsa` - user, paths, unit, socket, Nginx site, markers - and
# nothing touches files outside that namespace, so the server can safely host other sites too.
# =============================================================================

SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"   # <repo>/scripts
REPO_ROOT="$(cd "$SCRIPTS_DIR/.." && pwd)"
API_SRC="$REPO_ROOT/api"
CLIENT_SRC="$REPO_ROOT/client"

# --- operator config ---------------------------------------------------------------------------
[ -f "$SCRIPTS_DIR/.deploy.env" ] || { echo "ERROR: $SCRIPTS_DIR/.deploy.env not found (copy .deploy.env.example)"; exit 1; }
# shellcheck disable=SC1091
source "$SCRIPTS_DIR/.deploy.env"
: "${SERVER_HOST:?set SERVER_HOST in scripts/.deploy.env}"
: "${SSH_USER:?set SSH_USER in scripts/.deploy.env}"
DOMAIN="${DOMAIN:-ghabsa.com}"
SSH_PORT="${SSH_PORT:-22}"
REMOTE="$SSH_USER@$SERVER_HOST"

# One multiplexed SSH connection for the whole run: a deploy makes ~20 round-trips, and without
# this each pays a fresh handshake. %C keeps the socket path short (macOS caps it at 104 chars).
SSH_OPTS=(-p "$SSH_PORT" -o StrictHostKeyChecking=accept-new
          -o ControlMaster=auto -o "ControlPath=/tmp/ghabsa-ssh-%C" -o ControlPersist=120)
[ -n "${SSH_KEY:-}" ] && SSH_OPTS+=(-i "${SSH_KEY/#\~/$HOME}")

# --- server-side path standard: /opt/ghabsa/production/<type>/<project> ------------------------
SVC_USER="ghabsa"
APP_ROOT="/opt/ghabsa/production"
API_CODE="$APP_ROOT/api/ghabsa-api"        # rsync'd API source + node_modules (built on the box)
API_DATA="$APP_ROOT/data/ghabsa-api"       # persistent upload store - never touched by --delete
UI_DIR="$APP_ROOT/ui/ghabsa-client"        # built SPA
REMOTE_SCRIPTS="$APP_ROOT/scripts/remote"
ENV_LOCAL="$SCRIPTS_DIR/config/ghabsa-api.env"   # local source of truth (gitignored)
ENV_REMOTE="/etc/ghabsa/ghabsa-api.env"          # root:ghabsa 0640, read by systemd
NGINX_SITE="/etc/nginx/sites-available/ghabsa.conf"
TLS_MARKER="/etc/nginx/.ghabsa-tls-active"

# The API's multer destinations, relative to its working directory. On the server each is a
# symlink from the code dir into $API_DATA, so uploads survive every deploy.
UPLOAD_DIRS="uploads Dinner trendyPhoto adverts profile"

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

log()  { echo "[$(date '+%H:%M:%S')] $*"; }
die()  { echo "ERROR: $*" >&2; exit 1; }
ssh_cmd() { ssh "${SSH_OPTS[@]}" "$REMOTE" "$1"; }

# Run stdin as a ROOT bash script on the server, passing "$@" as its positional args (quoted, so
# values with spaces survive the remote shell).
ssh_script() {
  local q="" a
  for a in "$@"; do q="$q $(printf '%q' "$a")"; done
  ssh "${SSH_OPTS[@]}" "$REMOTE" "sudo bash -s --$q"
}

# rsync to the server as root (files land wherever needed; callers chown afterwards).
rsync_up() { rsync -az -e "ssh ${SSH_OPTS[*]}" --rsync-path="sudo rsync" "$@"; }

preflight() {
  ssh_cmd "true" || die "cannot SSH to $REMOTE"
  if ! ssh_cmd "sudo -n true" 2>/dev/null; then
    die "$SSH_USER lacks passwordless sudo on $SERVER_HOST (the deploy uses 'sudo rsync', which cannot answer a prompt)"
  fi
}

# True once DATABASE_URL holds a real MongoDB URI (init-config.sh writes a placeholder).
# The value may be quoted (systemd strips enclosing quotes when it loads the file).
config_ready() { grep -qE "^DATABASE_URL=[\"']?mongodb(\\+srv)?://" "$ENV_LOCAL" 2>/dev/null; }

# Ship the API env (secrets) from the local source of truth. Never edit it on the server - the next
# deploy overwrites the server copy from this one.
ship_config() {
  [ -f "$ENV_LOCAL" ] || die "$ENV_LOCAL not found - run: bash scripts/local/init-config.sh"
  log "==> Shipping API env -> $ENV_REMOTE"
  rsync_up "$ENV_LOCAL" "$REMOTE:$ENV_REMOTE"
  ssh_cmd "sudo chown root:$SVC_USER $ENV_REMOTE && sudo chmod 0640 $ENV_REMOTE"
}

sync_remote_scripts() {
  log "==> Syncing remote ops scripts -> $REMOTE_SCRIPTS"
  rsync_up --delete "$SCRIPTS_DIR/remote/" "$REMOTE:$REMOTE_SCRIPTS/"
  ssh_cmd "sudo chown -R $SVC_USER:$SVC_USER $REMOTE_SCRIPTS && sudo chmod 0755 $REMOTE_SCRIPTS/*.sh"
}

# -------------------------------------------------------------------------------------------------
# Install the Nginx site: the HTTP variant until setup-tls.sh sets $TLS_MARKER, the TLS variant
# after. FAIL-CLOSED - the new files are validated with `nginx -t` before any reload, and on failure
# the previous set is restored. A broken file left in sites-enabled would also fail every later
# `nginx -t` on the server, blocking any reload until someone fixes it by hand.
# Returns non-zero (rather than exiting) so callers can undo their own state first.
# -------------------------------------------------------------------------------------------------
sync_nginx() {
  local variant="http"
  if ssh_cmd "test -f $TLS_MARKER"; then
    variant="tls"
  elif ssh_cmd "grep -qE '^[[:space:]]*ssl_certificate' $NGINX_SITE 2>/dev/null"; then
    # DOWNGRADE GUARD: the live file terminates TLS but the marker is absent (certs installed by
    # hand). Shipping the HTTP variant would silently strip HTTPS, so refuse.
    echo "ERROR: $NGINX_SITE terminates TLS but $TLS_MARKER is absent - refusing to overwrite it"
    echo "       with the HTTP variant. Adopt it:  sudo touch $TLS_MARKER   then re-run."
    return 1
  fi
  log "==> Syncing Nginx site (ghabsa.$variant.conf, domain $DOMAIN)..."

  local stage; stage="$(mktemp -d)"
  sed "s/REPLACE_DOMAIN/$DOMAIN/g" "$SCRIPTS_DIR/nginx/ghabsa.$variant.conf" > "$stage/ghabsa.conf"
  cp "$SCRIPTS_DIR"/nginx/snippets/*.conf "$stage/"
  rsync -az -e "ssh ${SSH_OPTS[*]}" "$stage/" "$REMOTE:/tmp/ghabsa-nginx/"
  rm -rf "$stage"

  ssh_script "$NGINX_SITE" <<'EOF'
set -euo pipefail
SITE="$1"; ENABLED=/etc/nginx/sites-enabled/ghabsa.conf; SNIP=/etc/nginx/snippets
NEW=/tmp/ghabsa-nginx; PREV=/etc/nginx/.ghabsa-prev
SNIPPETS="ghabsa-site.conf ghabsa-headers.conf"

# Snapshot the live set so a rejected config can be put back exactly as it was.
rm -rf "$PREV"; mkdir -p "$PREV"
[ -f "$SITE" ] && cp -a "$SITE" "$PREV/ghabsa.conf"
for f in $SNIPPETS; do [ -f "$SNIP/$f" ] && cp -a "$SNIP/$f" "$PREV/$f"; done
had_link=0; [ -L "$ENABLED" ] && had_link=1

install -m 0644 "$NEW/ghabsa.conf" "$SITE"
for f in $SNIPPETS; do install -m 0644 "$NEW/$f" "$SNIP/$f"; done
ln -sfn "$SITE" "$ENABLED"
rm -rf "$NEW"
mkdir -p /var/www/certbot

if nginx -t 2>&1; then
  systemctl reload nginx
  echo "   Nginx validated and reloaded (graceful)."
else
  echo "ERROR: nginx -t rejected the new ghabsa config - restoring the previous one, NOT reloading."
  if [ -f "$PREV/ghabsa.conf" ]; then cp -a "$PREV/ghabsa.conf" "$SITE"; else rm -f "$SITE"; fi
  for f in $SNIPPETS; do
    if [ -f "$PREV/$f" ]; then cp -a "$PREV/$f" "$SNIP/$f"; else rm -f "$SNIP/$f"; fi
  done
  [ "$had_link" = 1 ] || rm -f "$ENABLED"
  nginx -t -q && echo "   Previous config restored and valid."
  exit 1
fi
EOF
}

run_remote_health_check() {
  log "==> Health check..."
  ssh_cmd "bash $REMOTE_SCRIPTS/health-check.sh $DOMAIN"
}
