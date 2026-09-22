#!/usr/bin/env bash
# =============================================================================
# Ghabsa - restart. Runs ON THE SERVER:
#   bash /opt/ghabsa/production/scripts/remote/restart.sh [api|nginx|all]    (default: api)
#
#   api    systemctl restart ghabsa-api (~1-2s of dropped requests), then wait for the socket
#   nginx  validate (nginx -t) then GRACEFUL reload - never a restart, which would drop every site's connections
# =============================================================================
set -euo pipefail
TARGET="${1:-api}"
log() { echo "[$(date '+%H:%M:%S')] $*"; }

restart_api() {
  log "restart ghabsa-api"
  sudo systemctl restart ghabsa-api
  for _ in $(seq 1 45); do sudo test -S /run/ghabsa/api.sock && { log "socket bound - up."; return; }; sleep 1; done
  log "ERROR: socket not bound after 45s:"; sudo journalctl -u ghabsa-api -n 20 --no-pager; exit 1
}
reload_nginx() {
  log "reload nginx (validate first)"
  if sudo nginx -t; then sudo systemctl reload nginx; log "nginx reloaded."; else log "ERROR: nginx -t failed - NOT reloaded."; exit 1; fi
}

case "$TARGET" in
  api)   restart_api ;;
  nginx) reload_nginx ;;
  all)   restart_api; reload_nginx ;;
  *) echo "Usage: restart.sh [api|nginx|all]"; exit 1 ;;
esac
