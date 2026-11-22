"""Generate ONE flattened apartment-room background
(public/assets/pixel/scenes/apartment_room.png) by pasting the existing
furniture PNGs (environment.py) at their true native pixel sizes onto a
single canvas -- a front-on "cutaway room" view (back wall + floor,
one fixed viewing angle, no mixed perspectives).

Scene Brief: Game Home's main scene, seen every day. Core message =
this person actually lives here and splits their time between "dealing
with money" and "resting". Composition Plan -- three functional zones,
left to right, not a furniture lineup:
  - Storage/entry (window, dresser)
  - Work nook (calendar, desk with laptop+lamp, pulled-out chair, a rug
    under this nook -- it's the "where you actually stand" mat, not
    filler) -- CHARACTER_SPOT is here, right beside the chair, as if
    just up from dealing with bills
  - Sleep zone (wall art, bed, bedside books, a plant)

This replaces the old approach (ApartmentScene.tsx compositing 9+
separate PNGs with hand-picked CSS width percentages), which is what
broke scale: a percentage chosen "by eye" for a 64px-wide bed and
another for a 32px-wide chair don't preserve their real 2:1 size
relationship. Pasting every asset at integer scale onto one canvas
means the room's furniture-to-furniture (and later, furniture-to-
character) proportions come from their real native pixel dimensions,
not from guessed CSS percentages.

The player's character sprite is NOT baked in here -- it still needs
to swap per mood/frame live, so ApartmentScene.tsx overlays it at a
size derived from this same canvas's pixel scale (see CHARACTER_SPOT
below, and the matching constant in the component).

Run from the project root (after environment.py, since it reuses those
PNGs from public/assets/pixel/environment/):
    python scripts/pixel-art/generators/apartment_room.py
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from canvas import Scene  # noqa: E402
from palette import PALETTE as P  # noqa: E402

TOOLS_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = TOOLS_DIR.parents[1]
ENV_DIR = PROJECT_ROOT / "public" / "assets" / "pixel" / "environment"
OUT_DIR = PROJECT_ROOT / "public" / "assets" / "pixel" / "scenes"
PREVIEW_DIR = TOOLS_DIR / "previews"

WIDTH, HEIGHT = 320, 160
FLOOR_Y = 108

# Where the live character sprite (32x32 native) should stand, in this
# canvas's own pixel coordinates -- ApartmentScene.tsx positions and
# sizes the character overlay from these same numbers so it shares the
# room's one pixel grid instead of an independently-guessed CSS size.
# Deliberately in the work nook, beside the chair -- not an arbitrary gap.
CHARACTER_SPOT = {"x": 150, "y": FLOOR_Y - 32, "w": 32, "h": 32}


def asset(name: str) -> Path:
    return ENV_DIR / f"{name}.png"


def build() -> Scene:
    s = Scene(WIDTH, HEIGHT, background=P["cream"])

    # wall band vs floor band
    s.rect(0, 0, WIDTH - 1, FLOOR_Y - 1, P["cream"])
    s.rect(0, FLOOR_Y, WIDTH - 1, HEIGHT - 1, P["brown_light"])
    s.rect(0, FLOOR_Y, WIDTH - 1, FLOOR_Y + 2, P["sage_dark"])

    # --- storage/entry zone ---
    s.paste(asset("window"), 16, 10)
    s.paste(asset("cabinet"), 16, FLOOR_Y - 64)

    # --- work nook: this is where decisions about money get made, and
    # where the character defaults to standing (CHARACTER_SPOT) ---
    s.paste(asset("calendar"), 120, 12)
    s.paste(asset("rug"), 120, FLOOR_Y - 56)  # underfoot of the whole nook
    s.paste(asset("desk"), 100, FLOOR_Y - 64)
    s.paste(asset("lamp"), 104, FLOOR_Y - 72)
    s.paste(asset("laptop"), 132, FLOOR_Y - 66)
    s.paste(asset("chair"), 108, FLOOR_Y - 32)

    # --- sleep zone: bed against the wall, bedside books, a plant ---
    s.paste(asset("wall_art"), 250, 12)
    s.paste(asset("bed"), 218, FLOOR_Y - 64)
    s.paste(asset("book_stack"), 184, FLOOR_Y - 32)
    s.paste(asset("plant"), 286, FLOOR_Y - 32)

    return s


def main() -> None:
    scene = build()
    saved = scene.save(OUT_DIR / "apartment_room.png")
    scene.save_preview(PREVIEW_DIR / "apartment_room_preview.png", scale=3)
    print(f"apartment_room: {saved} ({scene.width}x{scene.height})")
    print(f"character spot: {CHARACTER_SPOT}")


if __name__ == "__main__":
    main()
