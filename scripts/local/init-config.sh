#!/usr/bin/env bash
# =============================================================================
# Ghabsa - render scripts/config/ghabsa-api.env, the API's production env (secrets). Gitignored.
#
#   bash scripts/local/init-config.sh
#
# Idempotent: an existing file is kept as-is; only MISSING keys are added (a fresh JWT secret is
# generated). Edit values in that file, then `bash scripts/local/deploy.sh --config-only`.
# Never edit the server copy - the next deploy overwrites it from this one.
# =============================================================================
set -euo pipefail

SCRIPTS_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$SCRIPTS_DIR/config/ghabsa-api.env"
umask 077                                   # secrets: owner-only on this machine too

gen_secret() { openssl rand -hex 48 2>/dev/null || python3 -c 'import secrets;print(secrets.token_hex(48))'; }

if [ ! -f "$OUT" ]; then
  cat > "$OUT" <<EOF
# Ghabsa API - production env. GITIGNORED. Shipped to /etc/ghabsa/ghabsa-api.env (root:ghabsa 0640)
# by scripts/local/deploy.sh; systemd loads it into the ghabsa-api service.
# NODE_ENV and PORT (the Unix socket) are set by the systemd unit, not here.

# MongoDB Atlas connection string (Atlas -> Connect -> Drivers). The Atlas Network Access list must
# include the server's IP, or the API never binds its socket and /readyz stays down.
DATABASE_URL=REPLACE_ATLAS_URI

# Signs the auth JWT (api/routes/auth.js, api/utils/verifyToken.js). Rotating it logs everyone out.
JWT=$(gen_secret)

# Contact form (api/routes/contactUs.js) - Gmail SMTP. Needs a Gmail App Password, not the account
# password. The form answers 503 while MAIL_PASS is empty.
MAIL_USER=ghabsaitug@gmail.com
MAIL_PASS=
EOF
  echo "Created $OUT"
else
  # Add anything a newer version of this script expects, without touching existing values.
  grep -q '^DATABASE_URL=' "$OUT" || echo 'DATABASE_URL=REPLACE_ATLAS_URI' >> "$OUT"
  grep -q '^JWT=' "$OUT"          || echo "JWT=$(gen_secret)" >> "$OUT"
  grep -q '^MAIL_USER=' "$OUT"    || echo 'MAIL_USER=ghabsaitug@gmail.com' >> "$OUT"
  grep -q '^MAIL_PASS=' "$OUT"    || echo 'MAIL_PASS=' >> "$OUT"
  echo "Kept existing $OUT (added any missing keys)"
fi
chmod 600 "$OUT"

grep -qE "^DATABASE_URL=[\"']?mongodb(\\+srv)?://" "$OUT" \
  && echo "  DATABASE_URL: set" \
  || echo "  DATABASE_URL: NOT SET - paste the Atlas URI into $OUT (the API will not start without it)"
grep -qE '^MAIL_PASS=.+' "$OUT" \
  && echo "  MAIL_PASS:    set" \
  || echo "  MAIL_PASS:    empty - contact form disabled until a Gmail App Password is added"
