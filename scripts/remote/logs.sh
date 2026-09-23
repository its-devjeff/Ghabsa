#!/usr/bin/env bash
# =============================================================================
# Ghabsa - tail logs. Runs ON THE SERVER:
#   bash /opt/ghabsa/production/scripts/remote/logs.sh <target> [-f|--follow] [--lines=N]
#
#   api     the Node process (stdout/stderr -> journald; journald rotates it)
#   nginx   ghabsa's own access + error logs
#   errors  just the error streams: API errors + Nginx error log
# =============================================================================
set -euo pipefail

TARGET="${1:-}"; shift || true
LINES=100; FOLLOW=false
for arg in "$@"; do case $arg in
  --lines=*)   LINES="${arg#*=}" ;;
  -f|--follow) FOLLOW=true ;;
esac; done

journal() {
  if $FOLLOW; then sudo journalctl -u ghabsa-api -n "$LINES" -f "$@"
  else sudo journalctl -u ghabsa-api -n "$LINES" --no-pager "$@"; fi
}
tail_file() {
  if $FOLLOW; then sudo tail -n "$LINES" -F "$@"
  else for f in "$@"; do echo "=== $f ==="; sudo tail -n "$LINES" "$f" 2>/dev/null || echo "(missing)"; done; fi
}

case "$TARGET" in
  api)    journal ;;
  nginx)  tail_file /var/log/nginx/ghabsa.access.log /var/log/nginx/ghabsa.error.log ;;
  errors) journal -p warning; $FOLLOW || tail_file /var/log/nginx/ghabsa.error.log ;;
  *) echo "Usage: logs.sh [api|nginx|errors] [-f|--follow] [--lines=N]"; exit 1 ;;
esac
