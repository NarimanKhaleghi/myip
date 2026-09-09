#!/usr/bin/env python3
"""Definitive pixel-color audit of suspect regions in the full-page screenshot."""
from PIL import Image

img = Image.open("/home/z/my-project/download/regions-test.png").convert("RGB")
print(f"page size: {img.size}")

regions = {
    "flag-emoji": (429, 332, 17, 14),
    "footer-heart": (237, 3394, 15, 16),
    "zoom-control": (592, 877, 34, 64),
    "leaflet-attribution": (1123, 1235, 131, 14),
}

def audit(name, x, y, w, h, pad=4):
    crop = img.crop((x - pad, y - pad, x + w + pad, y + h + pad))
    px = list(crop.getdata())
    colored = []
    for r, g, b in px:
        mx, mn = max(r, g, b), min(r, g, b)
        if mx > 50 and (mx - mn) / mx > 0.2:  # clearly saturated
            colored.append((r, g, b))
    print(f"{name}: {len(colored)}/{len(px)} saturated px", colored[:6] if colored else "=> MONOCHROME")

for name, (x, y, w, h) in regions.items():
    audit(name, x, y, w, h)

# Also scan the entire map area (the biggest risk zone) — map container is roughly
# at the geo tab; zoom control at (592,877) so map spans around it
audit("map-area-sample", 700, 900, 400, 300, pad=0)
# Bottom strip sample of whole page
audit("page-bottom-strip", 0, 3350, 1440, 120, pad=0)
