#!/usr/bin/env python3
"""Check actual pixel colors in the footer heart region of screenshots."""
from PIL import Image

def check_saturation(path, box=None, label=""):
    img = Image.open(path).convert("RGB")
    if box:
        # box = (x, y, w, h) at original screenshot scale
        x, y, w, h = box
        img = img.crop((x, y, x + w, y + h))
    img2 = img.resize((min(200, img.width), min(200, img.height)))
    px = list(img2.getdata())
    # find max saturation among pixels that aren't near-gray
    max_sat = 0
    colored = 0
    for r, g, b in px:
        mx, mn = max(r, g, b), min(r, g, b)
        sat = (mx - mn) / mx if mx else 0
        if sat > 0.15 and mx > 60:
            colored += 1
        max_sat = max(max_sat, sat)
    print(f"{label}: size={img.size}, max_saturation={max_sat:.3f}, colored_px={colored}/{len(px)}")

# light mode full screenshot: heart at ~(1176, 3585) in a 1440-wide page scaled
check_saturation("/home/z/my-project/download/myip-mono-light-lookup.png", (1120, 3560, 110, 60), "LIGHT heart-region")
check_saturation("/home/z/my-project/download/myip-mono-dark-lookup.png", None, "DARK full-sample")
check_saturation("/home/z/my-project/download/myip-mono-light-lookup.png", None, "LIGHT full-sample")
check_saturation("/home/z/my-project/download/footer-zoom-check.png", None, "FOOTER-ZOOM viewport")
