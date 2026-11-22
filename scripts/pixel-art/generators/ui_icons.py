"""Generate the small 16x16 UI icon set used in the finance panel and
status bars: money/coin, stress, energy, income, expense, bill,
savings. Bold, simple, flat-color shapes -- at 16x16 there's no room
for detail, so silhouette is everything.

Run from the project root:
    python scripts/pixel-art/generators/ui_icons.py
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

SIZE = 16
OUTLINE = P["brown_dark"]


def icon_coin() -> PixelCanvas:
    c = PixelCanvas(SIZE, SIZE)
    c.circle(8, 8, 6, P["gold_dark"])
    c.circle(8, 8, 5, P["gold"])
    c.set(6, 6, P["cream_light"])
    c.auto_outline(OUTLINE)
    return c


def icon_stress() -> PixelCanvas:
    """A small storm cloud -- distinct blob silhouette from the
    energy bolt below."""
    c = PixelCanvas(SIZE, SIZE)
    c.circle(5, 7, 3, P["coral"])
    c.circle(9, 7, 3, P["coral"])
    c.circle(7, 5, 3, P["coral"])
    c.rect(4, 7, 10, 9, P["coral"])
    c.rect(5, 11, 6, 12, P["coral_dark"])   # raindrop
    c.rect(9, 11, 10, 12, P["coral_dark"])  # raindrop
    c.auto_outline(OUTLINE)
    return c


def icon_energy() -> PixelCanvas:
    """A stepped lightning bolt -- angular, reads differently from
    the stress cloud even at 16px."""
    c = PixelCanvas(SIZE, SIZE)
    c.rect(8, 1, 11, 5, P["sky"])
    c.rect(5, 5, 9, 7, P["sky"])
    c.rect(7, 7, 9, 8, P["sky"])
    c.rect(4, 8, 8, 13, P["sky"])
    c.auto_outline(OUTLINE)
    return c


def _chevron(c: PixelCanvas, flip: bool, color) -> None:
    rows = [(7, 9), (6, 10), (5, 11)]  # triangle, narrow at the tip
    ys = range(2, 5) if not flip else range(11, 8, -1)
    for (x0, x1), y in zip(rows, ys):
        c.rect(x0, y, x1, y, color)
    stem_y = (5, 11) if not flip else (4, 10)
    c.rect(7, stem_y[0], 9, stem_y[1], color)


def icon_income() -> PixelCanvas:
    c = PixelCanvas(SIZE, SIZE)
    _chevron(c, flip=False, color=P["sage"])
    c.auto_outline(OUTLINE)
    return c


def icon_expense() -> PixelCanvas:
    c = PixelCanvas(SIZE, SIZE)
    _chevron(c, flip=True, color=P["coral"])
    c.auto_outline(OUTLINE)
    return c


def icon_bill() -> PixelCanvas:
    c = PixelCanvas(SIZE, SIZE)
    c.rect(3, 2, 13, 14, P["cream_light"])
    c.rect(5, 5, 11, 6, P["brown"])
    c.rect(5, 8, 11, 9, P["brown"])
    c.rect(5, 11, 9, 12, P["brown"])
    c.auto_outline(OUTLINE)
    return c


def icon_savings() -> PixelCanvas:
    """A stacked coin pile -- distinct from the single coin icon."""
    c = PixelCanvas(SIZE, SIZE)
    c.rect(3, 10, 13, 13, P["gold_dark"])
    c.rect(3, 10, 13, 11, P["gold"])
    c.rect(4, 6, 12, 9, P["gold_dark"])
    c.rect(4, 6, 12, 7, P["gold"])
    c.rect(5, 2, 11, 5, P["gold_dark"])
    c.rect(5, 2, 11, 3, P["gold"])
    c.auto_outline(OUTLINE)
    return c


ICONS = {
    "coin": icon_coin,
    "stress": icon_stress,
    "energy": icon_energy,
    "income": icon_income,
    "expense": icon_expense,
    "bill": icon_bill,
    "savings": icon_savings,
}


def main() -> None:
    for name, builder in ICONS.items():
        canvas = builder()
        saved = canvas.save(OUT_DIR / f"{name}.png")
        canvas.save_preview(PREVIEW_DIR / f"icon_{name}_preview.png", scale=12)
        print(f"{name}: {saved}  ({canvas.width}x{canvas.height})")


if __name__ == "__main__":
    main()
