#!/usr/bin/env bash
# =============================================================================
# Ghabsa - health check from YOUR MACHINE: the full server-side check over SSH, then the public
# view (DNS + the site as a browser on the internet sees it).
#
#   bash scripts/local/health-check.sh
#
# Exit 0 = healthy, 1 = something failed.
# =============================================================================
set -uo pipefail
source "$(dirname "$0")/../lib/common.sh"

FAIL=0
ssh_cmd "bash $REMOTE_SCRIPTS/health-check.sh $DOMAIN" || FAIL=1

echo; echo "── PUBLIC (from this machine) ─────────────────────────────"
for name in "$DOMAIN" "www.$DOMAIN"; do
  printf "  %-26s -> %s\n" "$name" "$(dig +short "$name" A 2>/dev/null | tail -1)"
done

probe() {  # probe <expected-code> <url>
  local out code
  out="$(curl -sS -o /dev/null -w '%{http_code} %{time_total}s' --max-time 15 "$2" 2>/dev/null || echo 'ERR')"
  code="${out%% *}"
  if [ "$code" = "$1" ]; then printf "  OK   %-40s %s\n" "$2" "$out"
  else printf "  FAIL %-40s %s (expected %s)\n" "$2" "$out" "$1"; FAIL=1; fi
}

if ssh_cmd "test -f $TLS_MARKER"; then
  probe 200 "https://$DOMAIN/"
  probe 200 "https://$DOMAIN/readyz"
  probe 200 "https://$DOMAIN/api/post/listPosts"
  probe 301 "http://$DOMAIN/"
  probe 301 "https://www.$DOMAIN/"
else
  probe 200 "http://$DOMAIN/"
  probe 200 "http://$DOMAIN/readyz"
  probe 200 "http://$DOMAIN/api/post/listPosts"
fi

echo
[ "$FAIL" -eq 0 ] && { echo "  RESULT: HEALTHY"; exit 0; } || { echo "  RESULT: UNHEALTHY"; exit 1; }
