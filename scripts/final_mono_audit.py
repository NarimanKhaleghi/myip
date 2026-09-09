#!/usr/bin/env python3
"""Whole-page saturation audit: prove zero colored pixels on the final screenshots."""
from PIL import Image

def audit(path, label):
    img = Image.open(path).convert("RGB")
    w, h = img.size
    # Downsample to speed up: sample every pixel of a 1/2 scale copy
    small = img.resize((w // 2, h // 2))
    px = list(small.getdata())
    colored = []
    for r, g, b in px:
        mx, mn = max(r, g, b), min(r, g, b)
        if mx > 60 and (mx - mn) / mx > 0.18:
            colored.append((r, g, b))
    verdict = "PURE MONOCHROME" if not colored else str(colored[:8])
    print(f"{label}: {len(colored)}/{len(px)} saturated pixels -> {verdict}")

audit("/home/z/my-project/download/myip-final-light-v2.png", "LIGHT full-page")
audit("/home/z/my-project/download/myip-final-dark-v2.png", "DARK  full-page")
