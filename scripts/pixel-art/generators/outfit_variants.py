"""Recolor the user-supplied reference character's jacket into a few
different outfit colors, across all 8 frames of its turnaround GIF.

IMPORTANT capability note (read before assuming this is "the same thing
as PixelLab"): this script does NOT generate new art. It cannot draw a
different garment shape (a dress, a different sleeve cut, a hoodie vs a
cardigan) -- that needs a generative art tool, which this toolchain
doesn't have. What it CAN do, and does here: flood-fill-select the
jacket's pixels in each frame (a seed point + color-distance tolerance,
constrained to a torso bounding box so it can't leak into the face/
hands/hair) and rotate their hue in HSV space while preserving each
pixel's original saturation/value -- so all of the original soft
shading and anti-aliasing is kept exactly, only the hue changes. This
is a classic sprite recolor technique, not a redraw.

Run from the project root:
    python scripts/pixel-art/generators/outfit_variants.py
"""

from __future__ import annotations

import colorsys
from pathlib import Path

from PIL import Image

SRC_GIF = Path(
    r"C:\Users\86182\AppData\Local\Temp\claude\f3df90aa0f30a794"
    r"\24f94f5f-a917-41ba-a9b7-58db8df4afc8\images\10.gif"
)
OUT_DIR = Path(__file__).resolve().parents[1] / "previews" / "outfit_variants"

# The jacket's own exact palette (6 tones -- highlight through core-shadow
# fold), read off the source GIF by sampling its torso region. Matched
# EXACTLY (not by color distance): the sprite's skin tone happens to sit
# very close to the jacket's highlight in RGB space, so a fuzzy-distance
# mask would bleed between them, but the two are still distinct discrete
# palette entries, so exact-set membership keeps them apart cleanly.
JACKET_COLORS = {
    (248, 224, 177, 255),
    (238, 205, 161, 255),
    (218, 179, 146, 255),
    (194, 156, 130, 255),
    (177, 138, 115, 255),
    (154, 112, 93, 255),
}
# Spatial safety net on top of the exact-color match: even if one of the
# jacket's exact tones happened to also appear in hair/background outside
# this box, it would be left alone.
TORSO_BOX = (12, 26, 36, 45)  # (x0, y0, x1, y1), inclusive

# name -> hue in [0,1) to rotate the jacket to
OUTFITS = {
    "blue": 0.58,
    "sage": 0.33,
    "coral": 0.02,
    "charcoal": 0.0,  # special-cased to near-zero saturation below
}


def select_jacket(img: Image.Image, box: tuple[int, int, int, int]) -> set[tuple[int, int]]:
    x0, y0, x1, y1 = box
    px = img.load()
    found = set()
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if px[(x, y)] in JACKET_COLORS:
                found.add((x, y))
    return found


def recolor_frame(img: Image.Image, mask: set[tuple[int, int]], target_hue: float, desaturate: bool = False) -> Image.Image:
    out = img.copy()
    px = out.load()
    for x, y in mask:
        r, g, b, a = px[(x, y)]
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        new_s = s * 0.35 if desaturate else s
        nr, ng, nb = colorsys.hsv_to_rgb(target_hue, new_s, v)
        px[(x, y)] = (round(nr * 255), round(ng * 255), round(nb * 255), a)
    return out


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    src = Image.open(SRC_GIF)
    frames = []
    for i in range(src.n_frames):
        src.seek(i)
        frames.append(src.convert("RGBA").copy())
    w, h = frames[0].size

    # dump the selection mask for every frame so the fit can be checked
    for i, frame in enumerate(frames):
        mask0 = select_jacket(frame, TORSO_BOX)
        check = frame.copy()
        cpx = check.load()
        for x, y in mask0:
            cpx[(x, y)] = (255, 0, 255, 255)
        check.resize((w * 10, h * 10), Image.NEAREST).save(OUT_DIR / f"_mask_check_frame{i}.png")

    for name, hue in OUTFITS.items():
        out_frames = []
        for frame in frames:
            mask = select_jacket(frame, TORSO_BOX)
            out_frames.append(recolor_frame(frame, mask, hue, desaturate=(name == "charcoal")))

        sheet = Image.new("RGBA", (w * 8, h), (0, 0, 0, 0))
        for i, f in enumerate(out_frames):
            sheet.paste(f, (i * w, 0), f)
        sheet.resize((w * 8 * 6, h * 6), Image.NEAREST).save(OUT_DIR / f"{name}_sheet_preview.png")

        out_frames[0].resize((w * 8, h * 8), Image.NEAREST).save(OUT_DIR / f"{name}_front_preview.png")
        print(f"{name}: saved")


if __name__ == "__main__":
    main()
