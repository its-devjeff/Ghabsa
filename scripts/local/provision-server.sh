#!/usr/bin/env bash
# =============================================================================
# Ghabsa - commission the server for Ghabsa. Run FROM YOUR MACHINE.
#
#   bash scripts/local/provision-server.sh
#
#   1. preflight  - SSH + passwordless sudo
#   2. bootstrap  - Node 22, 2G swap, `ghabsa` user, /opt/ghabsa tree, /etc/ghabsa, systemd unit
#   3. config     - render scripts/config/ghabsa-api.env locally (JWT generated) and ship it
#   4. nginx      - install the HTTP site for DOMAIN (fail-closed)
#
# Then: scripts/local/setup-tls.sh (once DNS points here) and scripts/local/deploy.sh.
# Re-runnable: every step is idempotent.
# =============================================================================
set -euo pipefail
source "$(dirname "$0")/../lib/common.sh"

STAGE="/tmp/ghabsa-provision"

log "==> [1/4] Preflight: SSH + passwordless sudo on $REMOTE ..."
preflight

log "==> [2/4] Bootstrapping (Node, swap, service user, dirs, systemd unit)..."
ssh_cmd "rm -rf $STAGE && mkdir -p $STAGE"
rsync -az -e "ssh ${SSH_OPTS[*]}" "$SCRIPTS_DIR/provision" "$SCRIPTS_DIR/systemd" "$REMOTE:$STAGE/"
ssh_cmd "sudo bash $STAGE/provision/bootstrap.sh $DOMAIN"
ssh_cmd "rm -rf $STAGE"

log "==> [3/4] Config..."
bash "$SCRIPTS_DIR/local/init-config.sh"
ship_config

log "==> [4/4] Nginx site for $DOMAIN..."
sync_nginx || die "Nginx site not installed (see above) - the previous Nginx config was left as it was."
sync_remote_scripts

cat <<EOF

==> Server commissioned for Ghabsa. Next, from your machine:

    bash scripts/local/setup-tls.sh     # once $DOMAIN + www.$DOMAIN resolve to $SERVER_HOST
    bash scripts/local/deploy.sh        # ship API + SPA, start, health-check

The API env lives (gitignored, mode 600) at:
    $ENV_LOCAL
Set DATABASE_URL there before the first deploy - the API does not start without it.
EOF
