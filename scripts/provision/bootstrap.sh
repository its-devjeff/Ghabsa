#!/usr/bin/env bash
# =============================================================================
# Ghabsa - one-time server provisioning. Runs ON THE SERVER as root; driven remotely by
# scripts/local/provision-server.sh:
#   sudo bash bootstrap.sh <domain>
#
# Installs what Ghabsa needs, only where missing: Nginx, Certbot, UFW (22/80/443), build tools,
# Node.js 22 (Ubuntu archive), a 2G swapfile, the `ghabsa` service user, the /opt/ghabsa tree,
# /etc/ghabsa, and the ghabsa-api systemd unit. The Nginx site is installed separately (fail-closed)
# by sync_nginx; config + code by the deploy.
#
# Packages are installed only when absent (checked with dpkg), and there is deliberately NO
# `apt-get upgrade`: upgrading packages that are already present would restart unrelated services
# mid-flight. Security updates arrive via unattended-upgrades.
# Idempotent - safe to re-run.
# =============================================================================
set -euo pipefail

DOMAIN="${1:?usage: bootstrap.sh <domain>}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STAGE="$(cd "$SCRIPT_DIR/.." && pwd)"          # the rsync'd scripts/ subset

SVC_USER="ghabsa"
APP_ROOT="/opt/ghabsa/production"
API_DATA="$APP_ROOT/data/ghabsa-api"
UPLOAD_DIRS="uploads Dinner trendyPhoto adverts profile"
NODE_MIN_MAJOR=20

log()  { echo "[$(date '+%H:%M:%S')] $*"; }
step() { echo; echo "── $* ──────────────────────────────────────────────"; }

[ "$(id -u)" -eq 0 ] || { echo "ERROR: run as root"; exit 1; }
export DEBIAN_FRONTEND=noninteractive

# -----------------------------------------------------------------------------
step "1/6  System packages (only those missing)"
# -----------------------------------------------------------------------------
# build-essential + python3 are node-gyp's fallback for bcrypt; rsync receives every deploy.
missing=""
for p in nginx certbot ufw rsync curl build-essential python3; do
  dpkg -s "$p" >/dev/null 2>&1 || missing="$missing $p"
done
if [ -n "$missing" ]; then
  apt-get update -qq
  # shellcheck disable=SC2086
  apt-get install -y --no-install-recommends $missing
  log "Installed:$missing"
else
  log "All present."
fi
systemctl enable --now nginx >/dev/null 2>&1 || true

# -----------------------------------------------------------------------------
step "2/6  Node.js (Ubuntu archive - 26.04 ships Node 22 LTS)"
# -----------------------------------------------------------------------------
node_major() { node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0; }
if [ "$(node_major)" -lt "$NODE_MIN_MAJOR" ] || ! command -v npm >/dev/null 2>&1; then
  apt-get update -qq
  # npm is needed on the box: bcrypt is a native module and must be installed for linux-x64 here,
  # not copied from the operator's Mac.
  apt-get install -y --no-install-recommends nodejs npm
fi
log "Node: $(node -v)   npm: $(npm -v)"

# -----------------------------------------------------------------------------
step "3/6  Swap (2G safety net)"
# -----------------------------------------------------------------------------
# A small box with no swap: one memory spike and the OOM killer picks a victim.
# Low swappiness keeps it a last resort rather than a performance tax.
if [ -z "$(swapon --show --noheadings)" ]; then
  if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048 status=none
    chmod 600 /swapfile
    mkswap /swapfile >/dev/null
  fi
  swapon /swapfile
  log "Swap enabled: /swapfile"
else
  log "Swap already active."
fi
grep -qE '^/swapfile[[:space:]]' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
echo 'vm.swappiness=10' > /etc/sysctl.d/60-swappiness.conf
sysctl -q -p /etc/sysctl.d/60-swappiness.conf
swapon --show

# -----------------------------------------------------------------------------
step "4/6  Service user '${SVC_USER}'"
# -----------------------------------------------------------------------------
if ! id "$SVC_USER" >/dev/null 2>&1; then
  useradd --system --home-dir /opt/ghabsa --shell /usr/sbin/nologin "$SVC_USER"
  log "Created system user ${SVC_USER}."
else
  log "User ${SVC_USER} already exists."
fi
# Nginx (www-data) must reach the app socket in /run/ghabsa and read uploads (both group-only).
usermod -aG "$SVC_USER" www-data
log "www-data is in the ${SVC_USER} group."

# -----------------------------------------------------------------------------
step "5/6  Directory tree"
# -----------------------------------------------------------------------------
mkdir -p "$APP_ROOT/api/ghabsa-api" "$APP_ROOT/ui/ghabsa-client" "$APP_ROOT/scripts/remote"
for d in $UPLOAD_DIRS; do mkdir -p "$API_DATA/$d"; done
chown -R "$SVC_USER:$SVC_USER" /opt/ghabsa
chmod 0755 /opt/ghabsa
echo "$DOMAIN" > "$APP_ROOT/.domain"             # read by the remote ops scripts
# Out-of-tree secrets: the API env file lives here, root-owned, readable by the service group only.
mkdir -p /etc/ghabsa
chown root:"$SVC_USER" /etc/ghabsa
chmod 0750 /etc/ghabsa

# -----------------------------------------------------------------------------
step "6/6  systemd unit + firewall"
# -----------------------------------------------------------------------------
install -m 0644 "$STAGE/systemd/ghabsa-api.service" /etc/systemd/system/ghabsa-api.service
systemctl daemon-reload
# Enable-on-boot now; it first starts at the deploy that ships code + a real DATABASE_URL.
systemctl enable ghabsa-api
log "ghabsa-api.service installed and enabled."

# Firewall: add the three rules the site needs without resetting any existing ones, and enable UFW
# only if it is off (SSH is allowed first, so enabling can never lock the operator out).
ufw allow OpenSSH >/dev/null
ufw allow 80/tcp  >/dev/null
ufw allow 443/tcp >/dev/null
ufw status | grep -q '^Status: active' || ufw --force enable
log "UFW: $(ufw status | head -1)"

echo
log "==> Bootstrap complete."
