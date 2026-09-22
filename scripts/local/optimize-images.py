#!/usr/bin/env python3
"""Ghabsa deploy - write a resized WebP sibling (<name>.<ext>.webp) next to every large JPEG/PNG in
the SPA build. Nginx serves the sibling to browsers that accept WebP and the original to the rest
(see the `$ghabsa_webp_suffix` map in scripts/nginx/ghabsa.*.conf), so no URL or code changes.

    python optimize-images.py <build-dir> <cache-dir>

Run by scripts/local/deploy.sh after `npm run build`. The originals are never modified - they stay
the fallback. Conversions are cached by content hash, so a later deploy only pays for new or changed
images.
"""
import hashlib
import os
import shutil
import sys
from concurrent.futures import ProcessPoolExecutor

from PIL import Image, ImageOps

MAX_SIDE = 2400          # long-side cap: phone photos (4032px) and 7000px banners are downscaled, never up
QUALITY = 80
MIN_BYTES = 20_000       # smaller files aren't worth a second variant
MIN_SAVING = 0.10        # keep the WebP only when it is at least 10% smaller than the original
SKIP = {"logo192.png", "logo512.png"}   # PWA / touch icons - fetched by OS installers, keep them PNG
SETTINGS = f"v1:{MAX_SIDE}:{QUALITY}"   # part of the cache key, so changing a knob re-converts

Image.MAX_IMAGE_PIXELS = 200_000_000     # our own assets (a 7501x4001 banner trips the default guard)


def cache_key(path):
    h = hashlib.sha256(SETTINGS.encode())
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def convert(src, dst):
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)          # bake in phone-camera rotation - WebP drops EXIF
        has_alpha = im.mode in ("RGBA", "LA", "PA") or (im.mode == "P" and "transparency" in im.info)
        im = im.convert("RGBA" if has_alpha else "RGB")
        if max(im.size) > MAX_SIDE:
            im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        im.save(dst, "WEBP", quality=QUALITY, method=5)


def process(args):
    """Returns (path, original_bytes, served_bytes, cached)."""
    path, cache_dir = args
    orig = os.path.getsize(path)
    key = cache_key(path)
    webp_cached = os.path.join(cache_dir, key + ".webp")
    skip_marker = os.path.join(cache_dir, key + ".skip")
    cached = os.path.exists(webp_cached) or os.path.exists(skip_marker)

    if not cached:
        tmp = webp_cached + f".tmp{os.getpid()}"
        convert(path, tmp)
        if os.path.getsize(tmp) <= orig * (1 - MIN_SAVING):
            os.replace(tmp, webp_cached)
        else:
            os.remove(tmp)
            open(skip_marker, "w").close()

    if os.path.exists(webp_cached):
        shutil.copyfile(webp_cached, path + ".webp")
        return path, orig, os.path.getsize(webp_cached), cached
    return path, orig, orig, cached


def main():
    build_dir, cache_dir = sys.argv[1], sys.argv[2]
    os.makedirs(cache_dir, exist_ok=True)
    todo = []
    for root, _, files in os.walk(build_dir):
        for name in files:
            p = os.path.join(root, name)
            if (name.lower().endswith((".png", ".jpg", ".jpeg")) and name not in SKIP
                    and os.path.getsize(p) >= MIN_BYTES):
                todo.append((p, cache_dir))

    before = after = converted = 0
    with ProcessPoolExecutor() as pool:
        for path, orig, served, cached in pool.map(process, todo):
            before += orig
            after += served
            converted += not cached
    mb = 1 / 1048576
    print(f"   {len(todo)} images: {before * mb:.1f} MB -> {after * mb:.1f} MB served as WebP "
          f"({converted} converted, {len(todo) - converted} from cache)")


if __name__ == "__main__":
    main()
