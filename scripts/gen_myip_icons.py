#!/usr/bin/env python3
"""Generate myip monochrome icons (192/512/apple) + og-image.png (1200x630).
Pure black & white only — matches the myip design system."""
from PIL import Image, ImageDraw, ImageFont

PUB = "/home/z/my-project/myip/public"
INK = (10, 10, 10)        # #0a0a0a
PAPER = (245, 245, 245)   # #f5f5f5
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"


def make_icon(size: int) -> Image.Image:
    """Black rounded square + white frame + white globe mark."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    r = int(size * 0.22)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=INK)
    inset = max(2, int(size * 0.055))
    lw = max(2, int(size * 0.045))
    d.rounded_rectangle(
        [inset, inset, size - 1 - inset, size - 1 - inset],
        radius=int(r * 0.8), outline=PAPER, width=lw,
    )
    c = size / 2
    R = size * 0.265
    gw = max(2, int(size * 0.055))
    d.ellipse([c - R, c - R, c + R, c + R], outline=PAPER, width=gw)
    d.line([c - R, c, c + R, c], fill=PAPER, width=gw)
    mer = R / 1.7
    d.arc([c - mer, c - R, c + mer, c + R], 90, 270, fill=PAPER, width=gw)
    d.arc([c - mer, c - R, c + mer, c + R], 270, 90, fill=PAPER, width=gw)
    # small white square badge (bottom-right) — blueprint vibe
    b = max(4, int(size * 0.11))
    d.rounded_rectangle([size - inset - b * 2, size - inset - b * 2,
                         size - inset, size - inset], radius=int(b * 0.35), fill=PAPER)
    inner = b // 2
    bx = size - inset - b * 2 + inner
    d.rounded_rectangle([bx, bx, bx + b, bx + b], radius=int(b * 0.25), fill=INK)
    return img


def make_og() -> Image.Image:
    """1200x630 Open Graph image — light monochrome, Swiss typography."""
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    # outer double frame
    d.rectangle([10, 10, W - 11, H - 11], outline=INK, width=6)
    d.rectangle([26, 26, W - 27, H - 27], outline=INK, width=2)
    # giant wordmark
    f_big = ImageFont.truetype(BOLD, 260)
    d.text((72, 108), "myip", font=f_big, fill=INK)
    f_dot = ImageFont.truetype(MONO, 64)
    d.text((76, 400), ".thepm.ir", font=f_dot, fill=INK)
    # globe mark (right side)
    cx, cy, R = 985, 235, 105
    d.ellipse([cx - R, cy - R, cx + R, cy + R], outline=INK, width=10)
    d.line([cx - R, cy, cx + R, cy], fill=INK, width=10)
    mer = R / 1.7
    d.arc([cx - mer, cy - R, cx + mer, cy + R], 90, 270, fill=INK, width=10)
    d.arc([cx - mer, cy - R, cx + mer, cy + R], 270, 90, fill=INK, width=10)
    # white square badge inside globe bottom-right
    bs = 46
    d.rounded_rectangle([cx + R - bs, cy + R - bs, cx + R, cy + R], radius=12, fill=INK)
    d.rounded_rectangle([cx + R - bs + 14, cy + R - bs + 14, cx + R - 14, cy + R - 14],
                        radius=8, fill=PAPER)
    # sample IP under globe
    f_ip = ImageFont.truetype(MONO, 58)
    d.text((835, 385), "8.8.8.8", font=f_ip, fill=INK)
    # tagline
    f_tag = ImageFont.truetype(BOLD, 34)
    d.text((76, 500), "FREE · OPEN SOURCE · ZERO TRACKING · CLOUDFLARE WORKERS", font=f_tag, fill=INK)
    return img


if __name__ == "__main__":
    make_icon(192).save(f"{PUB}/icon-192.png")
    make_icon(512).save(f"{PUB}/icon-512.png")
    make_icon(180).save(f"{PUB}/apple-touch-icon.png")
    make_og().save(f"{PUB}/og-image.png")
    print("icons + og-image generated:")
    import os
    for f in ["icon-192.png", "icon-512.png", "apple-touch-icon.png", "og-image.png"]:
        p = f"{PUB}/{f}"
        print(f"  {f}: {os.path.getsize(p)//1024} KB")
