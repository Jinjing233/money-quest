"""Money Quest Apartment V3 -- preview-only compositor.

Builds ONE 3/4 top-down ("isometric-ish") apartment preview out of the
7 PixelLab-generated PNGs the user supplied (copied verbatim into
scripts/pixel-art/pixellab_src/, untouched -- this script never
redraws or edits their pixels, only scales each one uniformly with
nearest-neighbor and pastes it).

This is explicitly a PREVIEW, per the brief: it does NOT touch
ApartmentScene.tsx and is not wired into the game. Run it, look at the
output, and confirm before anything gets integrated.

Known limitation (reported, not silently patched): window.png and
rug.png are drawn in a flat/frontal style with no isometric angle,
while bed/desk_combo/chair/dresser/plant share one consistent 3/4
isometric angle. This script places all 7 anyway (frontal items
flattened onto the wall/floor) but the perspective mismatch is real
and visible -- see the written report, not just this docstring.

Run from the project root:
    python scripts/pixel-art/generators/apartment_v3_preview.py
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from palette import PALETTE as P  # noqa: E402

TOOLS_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = TOOLS_DIR.parents[1]
SRC_DIR = TOOLS_DIR / "pixellab_src"
PREVIEW_DIR = TOOLS_DIR / "previews"

CANVAS_W, CANVAS_H = 960, 720

# the floor diamond (2.33:1 width:height, typical of a fairly flat iso room)
FLOOR_CX, FLOOR_CY = 480, 480
FLOOR_HW, FLOOR_HH = 420, 180
WALL_H = 360


def rgba(name: str) -> tuple[int, int, int, int]:
    return P[name]


def build_shell() -> Image.Image:
    """Original wall + floor shell: two wall planes meeting at a back
    corner, rising from a floor diamond. Flat colors, hard edges (PIL's
    polygon fill has no antialiasing), matching the palette's warm
    beige / wood brown / sage green / soft blue."""
    img = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    top = (FLOOR_CX, FLOOR_CY - FLOOR_HH)
    right = (FLOOR_CX + FLOOR_HW, FLOOR_CY)
    bottom = (FLOOR_CX, FLOOR_CY + FLOOR_HH)
    left = (FLOOR_CX - FLOOR_HW, FLOOR_CY)
    top_up = (top[0], top[1] - WALL_H)
    left_up = (left[0], left[1] - WALL_H)
    right_up = (right[0], right[1] - WALL_H)

    # left wall (shadow side -- slightly dimmer beige)
    draw.polygon([top, left, left_up, top_up], fill=rgba("cream"))
    # right wall (lit side -- lighter beige)
    draw.polygon([top, right, right_up, top_up], fill=rgba("cream_light"))
    # back corner seam
    draw.line([top, top_up], fill=rgba("brown_light"), width=3)

    # floor (wood brown), lit-side half a touch lighter than shadow-side half
    draw.polygon([top, left, bottom, right], fill=rgba("brown_light"))
    draw.polygon([top, right, bottom], fill=rgba("brown"))

    # simple plank lines on the floor, following the left-to-bottom grain
    for i in range(1, 7):
        t = i / 7
        a = (left[0] + (bottom[0] - left[0]) * t, left[1] + (bottom[1] - left[1]) * t)
        b = (top[0] + (right[0] - top[0]) * t, top[1] + (right[1] - top[1]) * t)
        draw.line([a, b], fill=rgba("brown_dark"), width=2)

    # baseboard along the floor/wall seams
    draw.line([left, top], fill=rgba("brown_dark"), width=4)
    draw.line([top, right], fill=rgba("brown_dark"), width=4)

    return img


def paste_on(base: Image.Image, path: Path, anchor_x: int, anchor_y: int, scale: float) -> None:
    """Paste `path` (a 128x128 native PNG) scaled uniformly (nearest-
    neighbor, aspect ratio untouched since it's scaled equally on both
    axes) so its own non-transparent bounding box sits with bottom-
    center at (anchor_x, anchor_y) -- i.e. "feet"/base touch that point,
    nothing floats."""
    with Image.open(path) as src:
        img = src.convert("RGBA")
    bbox = img.getbbox() or (0, 0, img.width, img.height)
    new_size = (round(img.width * scale), round(img.height * scale))
    scaled = img.resize(new_size, Image.NEAREST)
    bx0, by0, bx1, by1 = (round(v * scale) for v in bbox)
    paste_x = anchor_x - (bx0 + bx1) // 2
    paste_y = anchor_y - by1
    base.paste(scaled, (paste_x, paste_y), scaled)


def build() -> Image.Image:
    scene = build_shell()
    SCALE = 1.5  # uniform for every asset -- preserves their relative scale

    # window: wall-mounted, left wall panel (flat/frontal asset on an
    # angled wall -- see the perspective-mismatch note in the module
    # docstring and the written report)
    paste_on(scene, SRC_DIR / "window.png", 270, 230, SCALE)

    # left zone: bed
    paste_on(scene, SRC_DIR / "bed.png", 230, 560, SCALE)

    # middle zone: rug (floor, flat asset -- least affected by the
    # perspective mismatch since rugs read fine near-flat), dresser,
    # plant
    paste_on(scene, SRC_DIR / "rug.png", 480, 560, SCALE)
    paste_on(scene, SRC_DIR / "dresser.png", 400, 480, SCALE)
    paste_on(scene, SRC_DIR / "plant.png", 575, 505, SCALE)

    # right zone: desk (already includes its own matching chair, lamp,
    # laptop in one asset -- see report re: the separate chair.png)
    paste_on(scene, SRC_DIR / "desk_combo.png", 715, 560, SCALE)

    return scene


def main() -> None:
    scene = build()
    out_path = PREVIEW_DIR / "apartment_v3_preview.png"
    scene.save(out_path)
    print(f"preview: {out_path} ({scene.width}x{scene.height})")
    print("NOT wired into ApartmentScene.tsx -- preview only, per the brief.")
    print("chair.png was NOT placed: desk_combo.png already includes a matching chair.")


if __name__ == "__main__":
    main()
