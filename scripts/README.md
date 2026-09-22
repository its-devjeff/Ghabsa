# Ghabsa deployment

Deploys the Ghabsa API (`api/`, Node/Express + MongoDB Atlas) and SPA (`client/`, CRA) to **ghabsa.com** on a single VPS. No Docker: systemd supervises Node, Nginx is the only public listener, and everything is driven from your machine over SSH/rsync. There is no git checkout on the server.

## Commands

```bash
bash scripts/local/provision-server.sh   # once: Node 22, swap, ghabsa user, dirs, unit, HTTP site
bash scripts/local/setup-tls.sh          # once DNS points here: Let's Encrypt for apex + www
bash scripts/local/deploy.sh             # API + SPA, then Nginx sync + health check
bash scripts/local/deploy.sh --api-only | --client-only | --config-only | --nginx-only
bash scripts/local/health-check.sh       # server-side checks + the public view
```

On the server (`ssh <user>@<host>`), under `/opt/ghabsa/production/scripts/remote/`:
`health-check.sh`, `logs.sh api|nginx|errors [-f]`, `restart.sh api|nginx|all`.

## Configuration (both files gitignored)

| File                         | Holds                                                   | Change it, then                        |
| ---------------------------- | ------------------------------------------------------- | -------------------------------------- |
| `scripts/.deploy.env`        | server, SSH user/key, `DOMAIN`, `LETSENCRYPT_EMAIL`     | nothing                                |
| `scripts/config/ghabsa-api.env` | `DATABASE_URL` (Atlas), `JWT`, `MAIL_USER`, `MAIL_PASS` | `deploy.sh --config-only`             |

`init-config.sh` renders the second file and generates `JWT`. **Never edit the copy on the server** (`/etc/ghabsa/ghabsa-api.env`), because the next deploy overwrites it. Atlas **Network Access must allow the server's IP**, or the API never binds its socket.

## How it's served

```
Internet :80/:443 → Nginx (server_name ghabsa.com www.ghabsa.com; never default_server)
   /                          → SPA   /opt/ghabsa/production/ui/ghabsa-client   (index.html no-cache)
   /static/                   → CRA hashed bundles, 1y immutable, pre-gzipped (gzip_static)
   /api/  /healthz  /readyz   → unix:/run/ghabsa/api.sock → ghabsa-api.service (node index.js)
   /uploads /Dinner /trendyPhoto /adverts /profile
                              → /opt/ghabsa/production/data/ghabsa-api  (straight from disk)
```

| Thing           | Value                                                                               |
| --------------- | ----------------------------------------------------------------------------------- |
| Service user    | `ghabsa` (nologin; `www-data` is in its group for the socket + uploads)             |
| Unit            | `ghabsa-api.service`: heap 384M, MemoryHigh 512M / MemoryMax 768M, ProtectSystem=strict |
| Code            | `/opt/ghabsa/production/api/ghabsa-api` (`node_modules` built on the box)           |
| Upload store    | `/opt/ghabsa/production/data/ghabsa-api/<dir>`; the code dir holds symlinks to it   |
| Secrets         | `/etc/ghabsa/ghabsa-api.env` (root:ghabsa 0640)                                     |
| Nginx           | `sites-available/ghabsa.conf` + `snippets/ghabsa-{site,headers}.conf`; logs `/var/log/nginx/ghabsa.*.log` |
| TLS             | `/etc/letsencrypt/live/ghabsa.com/` (apex + www); marker `/etc/nginx/.ghabsa-tls-active` |
| App logs        | journald: `journalctl -u ghabsa-api`                                                 |

## Guarantees the scripts keep

- **Uploads survive deploys.** The code rsync excludes the upload dirs, which also protects them from `--delete`. Seed images committed in `api/` are copied in add-only mode, so a file uploaded on the server always wins.
- **Nginx changes are fail-closed.** Every change is validated with `nginx -t` before a graceful reload, and a rejected config is rolled back. The site only answers for its own names, so it never captures traffic meant for any other server block.
- **`npm ci` runs only when `api/package-lock.json` changes.** It runs on the box because `bcrypt` is native.
- **Icons and the manifest are cache-busted automatically.** At deploy time, `favicon.ico`, `logo192.png` and `manifest.json` get a `?v=<content hash>` in `index.html`, and the manifest's own icon links get one too. Browsers keep their cached copy until the file actually changes, so there's no version number to bump by hand.
- **Large images ship as WebP.** Each JPEG/PNG over 20 KB in the build gets a resized `.webp` sibling (long side capped at 2400 px), and Nginx serves it to browsers that accept WebP. URLs and code don't change, and the originals stay as the fallback. Conversions are cached in `scripts/.cache/`, so only new or changed images cost time.
- **The SPA swaps atomically** (`--delay-updates --delete-after`), so a visitor never gets an `index.html` pointing at a missing bundle.

## Not covered yet

- **Database backups.** Atlas M0 (free tier) has no automated backups. Upgrade the tier, or add a `mongodump` timer.
- **Upload-store backups.** Nothing copies `/opt/ghabsa/production/data` off the box yet.
- **Uploads from the previous host.** Files uploaded before this deployment (`api/uploads/`, `api/Dinner/`) were never in git, so the posts, dinner tables and timer that reference them show broken images. Copy them into `/opt/ghabsa/production/data/ghabsa-api/<dir>/` add-only (`rsync --ignore-existing`), then `chown -R ghabsa:ghabsa`. No redeploy needed.
