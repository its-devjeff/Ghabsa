#!/usr/bin/env bash
# =============================================================================
# Ghabsa - deploy the API and/or the SPA. Run FROM YOUR MACHINE (drives the server over SSH).
#
#   bash scripts/local/deploy.sh                 # API + SPA, then Nginx sync + health check
#   bash scripts/local/deploy.sh --api-only
#   bash scripts/local/deploy.sh --client-only
#   bash scripts/local/deploy.sh --config-only   # ship config/ghabsa-api.env + restart the API
#   bash scripts/local/deploy.sh --nginx-only    # re-sync + validate + reload the Nginx site
#
# API:  rsync code -> seed + link the upload store -> ship env -> sync unit -> npm ci (only when
#       package-lock.json changed) -> restart -> wait for the socket
# SPA:  npm ci (only when needed) -> react-scripts build -> pre-gzip -> rsync with an atomic swap
# Then: sync ops scripts + Nginx (fail-closed) -> health check (fails the deploy loudly).
#
# Restarting the API drops in-flight requests for ~1-2s (single node, no hand-off).
# Requires scripts/.deploy.env and passwordless sudo for SSH_USER.
# =============================================================================
set -euo pipefail
source "$(dirname "$0")/../lib/common.sh"

DO_API=true; DO_CLIENT=true; CONFIG_ONLY=false; NGINX_ONLY=false
for arg in "$@"; do case $arg in
  --api-only)    DO_CLIENT=false ;;
  --client-only) DO_API=false ;;
  --config-only) CONFIG_ONLY=true ;;
  --nginx-only)  NGINX_ONLY=true ;;
  *) die "unknown flag: $arg (see the header of $0)" ;;
esac; done

START=$(date +%s)

# -------------------------------------------------------------------------------------------------
# API
# -------------------------------------------------------------------------------------------------
ship_api_code() {
  log "==> Shipping API code -> $API_CODE"
  # Anchored excludes are relative to api/, and they also PROTECT those paths on the server from
  # --delete: node_modules is built there, and each upload dir is a symlink into the data store.
  # NO trailing slash on the upload dirs on purpose - `/uploads/` matches only a directory, not the
  # symlink the server holds, so --delete would remove the link.
  rsync_up --delete \
    --exclude '/node_modules' \
    --exclude '/uploads' --exclude '/Dinner' --exclude '/trendyPhoto' --exclude '/adverts' --exclude '/profile' \
    --exclude '/.env' --exclude '/.env.*' --exclude '/credentials.json' --exclude '/index.js.bak' \
    --exclude '.DS_Store' --exclude '*.log' --exclude '.git' \
    "$API_SRC/" "$REMOTE:$API_CODE/"

  # The repo ships seed images in four of the upload dirs. Copy any the store lacks - never
  # overwrite, never delete - so what users uploaded on the server always wins.
  log "==> Seeding committed images into the upload store (add-only)..."
  local d
  for d in Dinner trendyPhoto adverts profile; do
    [ -d "$API_SRC/$d" ] || continue
    rsync_up --ignore-existing --exclude '.DS_Store' "$API_SRC/$d/" "$REMOTE:$API_DATA/$d/"
  done

  ssh_script "$API_CODE" "$API_DATA" "$UPLOAD_DIRS" "$SVC_USER" <<'EOF'
set -euo pipefail
code="$1"; data="$2"; dirs="$3"; svc="$4"
for d in $dirs; do
  mkdir -p "$data/$d"
  # A real directory here (e.g. from a hand copy) is folded into the store before being linked.
  if [ -d "$code/$d" ] && [ ! -L "$code/$d" ]; then
    cp -an "$code/$d/." "$data/$d/" && rm -rf "${code:?}/$d"
  fi
  ln -sfn "$data/$d" "$code/$d"
done
chown -R "$svc:$svc" "$code" "$data"
EOF
}

sync_unit() {
  # Keep the unit in lockstep with the repo; daemon-reload only when it actually changed.
  rsync -az -e "ssh ${SSH_OPTS[*]}" "$SCRIPTS_DIR/systemd/ghabsa-api.service" "$REMOTE:/tmp/ghabsa-api.service"
  ssh_cmd "if ! cmp -s /tmp/ghabsa-api.service /etc/systemd/system/ghabsa-api.service; then \
             sudo install -m 0644 /tmp/ghabsa-api.service /etc/systemd/system/ghabsa-api.service && \
             sudo systemctl daemon-reload && echo '   systemd unit updated.'; fi; rm -f /tmp/ghabsa-api.service"
}

install_api_deps() {
  # npm ci runs ON THE BOX (bcrypt is native - it must be built/fetched for linux-x64, not macOS).
  # Skipped when package-lock.json is unchanged since the last install: that is most deploys.
  local want have
  want="$(shasum -a 256 "$API_SRC/package-lock.json" | awk '{print $1}')"
  have="$(ssh_cmd "cat $API_CODE/node_modules/.ghabsa-lock-sha 2>/dev/null" || true)"
  if [ "$want" = "$have" ]; then
    log "==> API dependencies unchanged - skipping npm ci."
    return
  fi
  log "==> npm ci --omit=dev on the server (package-lock.json changed)..."
  ssh_cmd "sudo -u $SVC_USER -H bash -c 'cd $API_CODE && npm ci --omit=dev --no-audit --no-fund && echo $want > node_modules/.ghabsa-lock-sha'"
}

restart_api() {
  if ! config_ready; then
    log "==> SKIPPING API start: DATABASE_URL in $ENV_LOCAL is not a MongoDB URI yet."
    return
  fi
  log "==> Restarting ghabsa-api..."
  ssh_cmd "sudo systemctl restart ghabsa-api"
  # The app binds its socket only AFTER MongoDB accepts the connection, so the socket appearing is
  # the real readiness signal. An Atlas cold connect can take several seconds.
  if ssh_cmd "for i in \$(seq 1 45); do sudo test -S /run/ghabsa/api.sock && exit 0; sleep 1; done; exit 1"; then
    log "   API up (socket bound, MongoDB connected)."
  else
    log "ERROR: the API did not bind its socket within 45s. Recent log:"
    ssh_cmd "sudo journalctl -u ghabsa-api -n 30 --no-pager" || true
    echo "  Most likely: Atlas Network Access does not allow $SERVER_HOST, or DATABASE_URL is wrong."
    exit 1
  fi
}

# -------------------------------------------------------------------------------------------------
# SPA
# -------------------------------------------------------------------------------------------------
deploy_client() {
  command -v npm >/dev/null 2>&1 || die "npm not found on this machine (needed to build the SPA)"
  (
    cd "$CLIENT_SRC"
    if [ ! -d node_modules ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
      log "==> npm ci (client)..."
      # --legacy-peer-deps: the lockfile was resolved that way - react-html-parser@2 declares a
      # React <=16 peer while the app is on React 18, which strict resolution (npm >= 7) rejects.
      npm ci --no-audit --no-fund --legacy-peer-deps
    fi

    log "==> Building SPA..."
    # Same-origin build: every API call and image URL in the SPA is relative, so there is no API
    # URL to bake in. No source maps (smaller, no source on the public site); lint belongs to the
    # dev loop, not the deploy; CI=false so CRA's warnings don't fail the build.
    rm -rf build
    CI=false GENERATE_SOURCEMAP=false DISABLE_ESLINT_PLUGIN=true npm run build
    [ -f build/index.html ] || die "build produced no build/index.html"

    # Cache-bust the files CRA doesn't content-hash: stamp each reference with a short hash of the
    # file itself, so browsers keep their cached copy exactly until the file changes. The manifest's
    # icon refs go first, so an icon change also changes the manifest's own hash. Must run before
    # the gzip step, or index.html.gz would keep the unstamped links.
    stamp() { shasum -a 256 "build/$1" | cut -c1-8; }
    sub()   { sed "$1" "$2" > "$2.tmp" && mv "$2.tmp" "$2"; }
    for f in favicon.ico logo192.png logo512.png; do
      sub "s#\"$f\"#\"$f?v=$(stamp "$f")\"#g" build/manifest.json
    done
    for f in favicon.ico logo192.png manifest.json; do
      sub "s#href=\"/$f\"#href=\"/$f?v=$(stamp "$f")\"#g" build/index.html
    done
    grep -q 'favicon\.ico?v=' build/index.html || die "icon cache-bust stamp did not apply to build/index.html"

    # The site ships ~56MB of camera-original photos. A resized WebP sibling of each, served by
    # Nginx content negotiation, cuts that to a fraction with no URL/code changes (originals stay the
    # fallback). Pillow lives in a private venv; results are cached, so re-deploys are near-instant.
    log "==> Generating WebP variants of large images (cached)..."
    IMG_VENV="$SCRIPTS_DIR/.venv"
    if ! "$IMG_VENV/bin/python" -c 'import PIL' 2>/dev/null; then
      python3 -m venv "$IMG_VENV" && "$IMG_VENV/bin/pip" install -q --disable-pip-version-check pillow
    fi
    "$IMG_VENV/bin/python" "$SCRIPTS_DIR/local/optimize-images.py" build "$SCRIPTS_DIR/.cache/webp"

    log "==> Pre-compressing text assets (served by gzip_static)..."
    find build -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' -o -name '*.json' \
      -o -name '*.svg' -o -name '*.txt' -o -name '*.ico' \) -size +1k -exec gzip -9 -k -f {} +
  )

  log "==> Shipping SPA -> $UI_DIR"
  # --delay-updates + --delete-after: every new file lands before any is swapped in, and old ones go
  # last, so a visitor mid-deploy never gets an index.html pointing at a bundle that isn't there.
  rsync_up --delete-after --delay-updates --exclude '.DS_Store' "$CLIENT_SRC/build/" "$REMOTE:$UI_DIR/"
  ssh_cmd "sudo chown -R $SVC_USER:$SVC_USER $UI_DIR"
}

# -------------------------------------------------------------------------------------------------
# Flow
# -------------------------------------------------------------------------------------------------
# Until DATABASE_URL is a real URI the API is expected to be down, so the health gate is skipped.
API_STARTED=true; config_ready || API_STARTED=false
preflight

if $NGINX_ONLY; then
  sync_nginx || die "Nginx sync failed - previous config restored."
  run_remote_health_check || die "health check reported failures (see above)"
  log "==> Nginx-only deploy complete ($TIMESTAMP)."
  exit 0
fi

if $CONFIG_ONLY; then
  ship_config
  restart_api
  $API_STARTED && { run_remote_health_check || die "health check reported failures (see above)"; }
  log "==> Config-only deploy complete ($TIMESTAMP)."
  exit 0
fi

if $DO_API; then
  log "═══════════════ API ═══════════════"
  ship_api_code
  ship_config
  sync_unit
  install_api_deps
  restart_api
fi

if $DO_CLIENT; then
  log "═══════════════ SPA ═══════════════"
  deploy_client
fi

sync_remote_scripts
sync_nginx || die "Nginx sync failed - previous config restored."

if $API_STARTED; then
  run_remote_health_check || die "health check reported failures (see above)"
else
  echo
  echo "  API code is on the box but NOT started. Set DATABASE_URL in $ENV_LOCAL, then:"
  echo "      bash scripts/local/deploy.sh --config-only"
fi

PROTO="http"; ssh_cmd "test -f $TLS_MARKER" && PROTO="https"
log ""
log "==> Deploy complete in $(( $(date +%s) - START ))s ($TIMESTAMP)."
echo
echo "  ┌──────────────────────────────────────────────"
echo "  │  Site :  $PROTO://$DOMAIN/"
echo "  │  API  :  $PROTO://$DOMAIN/api/"
echo "  │  Ready:  $PROTO://$DOMAIN/readyz"
echo "  └──────────────────────────────────────────────"
