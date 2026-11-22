"""Generate the 24x24 event-category icons used on EventCard: housing,
food, transit, medical, work, social. Which event id maps to which
category is a presentational concern, kept in
src/components/eventCategoryIcons.ts (not in src/data/).

Run from the project root:
    python scripts/pixel-art/generators/event_icons.py
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from canvas import PixelCanvas  # noqa: E402
from palette import PALETTE as P  # noqa: E402

TOOLS_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = TOOLS_DIR.parents[1]
OUT_DIR = PROJECT_ROOT / "public" / "assets" / "pixel" / "ui"
PREVIEW_DIR = TOOLS_DIR / "previews"

SIZE = 24
OUTLINE = P["brown_dark"]


def icon_housing() -> PixelCanvas:
    c = PixelCanvas(SIZE, SIZE)
    c.rect(5, 12, 19, 21, P["brown_light"])
    for i in range(7):
        c.rect(3 + i, 5 + i, 21 - i, 5 + i, P["brown"])
    c.rect(10, 15, 14, 21, P["brown_dark"])
    c.set(7, 14, P["gold"])
    c.auto_outline(OUTLINE)
    return c


def icon_food() -> PixelCanvas:
    c = PixelCanvas(SIZE, SIZE)
    c.circle(12, 13, 8, P["coral"])
    c.circle(9, 10, 3, P["coral_dark"])
    c.rect(13, 3, 14, 7, P["sage_dark"])
    c.auto_outline(OUTLINE)
    return c


def icon_transit() -> PixelCanvas:
    c = PixelCanvas(SIZE, SIZE)
    c.rect(3, 8, 21, 17, P["sky"])
    c.rect(3, 8, 21, 11, P["sky_dark"])
    c.rect(5, 12, 10, 15, P["cream_light"])
    c.rect(13, 12, 18, 15, P["cream_light"])
    c.circle(7, 18, 2, P["brown_dark"])
    c.circle(17, 18, 2, P["brown_dark"])
    c.auto_outline(OUTLINE)
    return c


def icon_medical() -> PixelCanvas:
    c = PixelCanvas(SIZE, SIZE)
    c.circle(12, 12, 10, P["cream_light"])
    c.rect(10, 5, 13, 19, P["coral"])
    c.rect(5, 10, 19, 13, P["coral"])
    c.auto_outline(OUTLINE)
    return c


def icon_work() -> PixelCanvas:
    c = PixelCanvas(SIZE, SIZE)
    c.rect(9, 3, 14, 7, P["brown_dark"])
    c.rect(3, 8, 20, 20, P["brown_light"])
    c.rect(3, 8, 20, 11, P["brown"])
    c.rect(10, 11, 13, 14, P["brown_dark"])
    c.auto_outline(OUTLINE)
    return c


def icon_social() -> PixelCanvas:
    """A speech bubble -- clearer at 24px than two overlapping heads."""
    c = PixelCanvas(SIZE, SIZE)
    c.rect(3, 4, 20, 15, P["sage"])
    c.rect(6, 15, 9, 18, P["sage"])
    for x, y in ((7, 8), (11, 8), (15, 8)):
        c.rect(x, y, x + 1, y + 1, P["cream_light"])
    c.auto_outline(OUTLINE)
    return c


ICONS = {
    "event_housing": icon_housing,
    "event_food": icon_food,
    "event_transit": icon_transit,
    "event_medical": icon_medical,
    "event_work": icon_work,
    "event_social": icon_social,
}


def main() -> None:
    for name, builder in ICONS.items():
        canvas = builder()
        saved = canvas.save(OUT_DIR / f"{name}.png")
        canvas.save_preview(PREVIEW_DIR / f"{name}_preview.png", scale=10)
        print(f"{name}: {saved}  ({canvas.width}x{canvas.height})")


if __name__ == "__main__":
    main()
