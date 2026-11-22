"""Generate the one-off hero/scene illustrations: the Welcome Screen
background and the three Game Result ending illustrations.

These are bespoke compositions (not a repeated small-icon family), so
they live in public/assets/pixel/scenes/ and aren't held to one fixed
size the way characters/items/environment/ui are -- validate.py still
checks they're valid transparent PNGs, just not a specific size.

Run from the project root:
    python scripts/pixel-art/generators/scenes.py
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from canvas import PixelCanvas, Scene  # noqa: E402
from palette import PALETTE as P  # noqa: E402

TOOLS_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = TOOLS_DIR.parents[1]
OUT_DIR = PROJECT_ROOT / "public" / "assets" / "pixel" / "scenes"
PREVIEW_DIR = TOOLS_DIR / "previews"
CHAR_DIR = PROJECT_ROOT / "public" / "assets" / "pixel" / "characters"
ENV_DIR = PROJECT_ROOT / "public" / "assets" / "pixel" / "environment"

OUTLINE = P["brown_dark"]


def triangle_roof(c: PixelCanvas, x0: int, x1: int, y0: int, height: int, color) -> None:
    """A simple symmetric pitched roof, narrowing to a point at the top."""
    for i in range(height):
        y = y0 + i
        inset = int((i / height) * ((x1 - x0) / 2))
        c.rect(x0 + inset, y, x1 - inset, y, color)


def house(c: PixelCanvas, x: int, base_y: int, width: int, wall_h: int, roof_h: int, wall, roof, lit: bool) -> None:
    c.rect(x, base_y - wall_h, x + width, base_y, wall)
    triangle_roof(c, x - 2, x + width + 2, base_y - wall_h - roof_h, roof_h, roof)
    door_w = max(3, width // 4)
    door_x = x + (width - door_w) // 2
    c.rect(door_x, base_y - door_w - 2, door_x + door_w, base_y, P["brown_dark"])
    win_color = P["gold"] if lit else P["brown_dark"]
    win_x = x + 2
    win_y = base_y - wall_h + 3
    c.rect(win_x, win_y, win_x + 3, win_y + 3, win_color)


def tree(c: PixelCanvas, cx: int, base_y: int, size: int = 1) -> None:
    r = 5 * size
    c.circle(cx, base_y - r - 2 * size, r, P["sage"])
    c.circle(cx - r // 2, base_y - r, r - 1, P["sage_dark"])
    c.rect(cx - size, base_y - 2 * size, cx + size, base_y, P["brown"])


def coin(c: PixelCanvas, cx: int, cy: int, r: int = 4) -> None:
    c.circle(cx, cy, r, P["gold_dark"])
    c.circle(cx, cy, r - 1, P["gold"])
    c.set(cx - 1, cy - 1, P["cream_light"])


def welcome_bg() -> Scene:
    """The Welcome Screen hero image.

    Scene Brief: Welcome screen, first thing the player sees. Core
    message = "independent life + money pressure + daily financial
    choices". Subject = the young person, not the building. The
    apartment building is background-only context (small, pushed to a
    far corner), never competing with the character for visual weight.

    Composition Plan: eye-level scene, 256x128. Character pasted at a
    clean 2x scale from the real sprite (same native grid as every
    other asset). Exactly one foreground prop carries the "money
    pressure" read -- a bill held in both hands -- plus a few coins at
    the feet to reinforce "not much money left". No phone/mug/transit
    card this round: they repeated the same "money" message as the
    bill without adding a new one, so per the scene-over-decoration
    rule they're cut rather than piled on.
    """
    W, H = 256, 128
    GROUND_Y = 100
    s = Scene(W, H, background=P["cream"])

    s.rect(0, GROUND_Y, W - 1, H - 1, P["brown_light"])
    s.rect(0, GROUND_Y, W - 1, GROUND_Y + 1, P["brown_dark"])  # curb line

    # the apartment building -- background context only: small, distant,
    # pushed into the corner so it never competes with the character.
    s.rect(192, 34, 240, GROUND_Y, P["brown_light"])
    s.rect(190, 30, 242, 34, P["brown_dark"])
    window_lit = [[True, False], [False, True]]
    for row in range(2):
        for col in range(2):
            x = 198 + col * 24
            y = 44 + row * 22
            color = P["gold"] if window_lit[row][col] else P["brown_dark"]
            s.rect(x, y, x + 10, y + 10, color)

    # the young person themself -- front and center, the clear subject
    s.paste(CHAR_DIR / "character_student_normal_0.png", 40, GROUND_Y - 64, scale=2)

    # the one core prop: a bill held up in both hands
    s.rect(94, 76, 112, 96, P["cream_light"])
    s.rect(97, 80, 109, 82, P["brown"])
    s.rect(97, 86, 105, 88, P["brown"])
    s.rect(97, 92, 109, 94, P["coral"])  # amount due, drawing the eye

    # loose change at the feet -- not much left over
    s.circle(28, 96, 5, P["gold_dark"])
    s.circle(28, 96, 4, P["gold"])
    s.circle(50, 93, 4, P["gold_dark"])
    s.circle(50, 93, 3, P["gold"])

    return s


def ending_stable() -> PixelCanvas:
    c = PixelCanvas(128, 128)
    c.rect(0, 0, 127, 90, P["cream"])
    c.circle(100, 20, 14, P["gold"])
    c.rect(0, 90, 127, 127, P["sage"])
    c.rect(0, 90, 127, 94, P["sage_dark"])

    house(c, 36, 100, 56, 40, 16, P["cream_light"], P["brown"], lit=True)
    tree(c, 18, 112, size=2)
    coin(c, 90, 108, 6)
    coin(c, 100, 112, 5)
    coin(c, 95, 118, 5)

    c.auto_outline(OUTLINE)
    return c


def ending_scraping() -> Scene:
    """Scene Brief: "Scraping By" means rent got paid, the lights are
    still on, but there's nothing left over and no room for error --
    not thriving (that's Stable: sunshine + a coin pile), not falling
    apart (that's Debt: rain clouds + bills + a stressed pose). The
    same house as the other two endings, but a plainer wall color, a
    smaller/modest tree, a paid-off bill by the door (money went
    somewhere, not nowhere), exactly one coin left (not a pile, not
    zero), and the character standing by their own door in a perfectly
    ordinary "normal" pose -- tired but still here, not dramatized.

    Composition Plan: same 128x128 canvas and same house(base_y=100,
    width=56, wall_h=40, roof_h=16) as ending_stable/ending_debt, so the
    three read as one consistent series. Character pasted at true 1:1
    native scale (32x32, no upscale) -- not the old 1.25x mismatch.
    """
    s = Scene(128, 128, background=P["cream_light"])
    s.rect(0, 90, 127, 127, P["brown_light"])
    s.rect(0, 90, 127, 94, P["sage_dark"])

    house(s, 36, 100, 56, 40, 16, P["brown"], P["brown_dark"], lit=True)
    tree(s, 18, 112, size=1)

    # a paid bill by the door -- the money had somewhere to go, it's not
    # just missing -- and exactly one coin left over, not a pile.
    s.rect(94, 100, 108, 116, P["cream_light"])
    s.rect(97, 104, 105, 106, P["brown"])
    s.rect(97, 109, 105, 111, P["sage_dark"])  # a line struck through: paid

    s.circle(100, 120, 4, P["gold_dark"])
    s.circle(100, 120, 3, P["gold"])

    # NOTE: the character is NOT baked in here -- GameResultScreen.tsx
    # overlays the live, mood-swapping CharacterSprite on top of every
    # ending PNG at a shared position (bottom-[21%] left-[58%], matching
    # this house's doorway) so there's exactly one character, not two.
    return s


def ending_debt() -> PixelCanvas:
    c = PixelCanvas(128, 128)
    c.rect(0, 0, 127, 90, P["cream_light"])
    c.rect(0, 90, 127, 127, P["brown_light"])
    c.rect(0, 90, 127, 94, P["sage_dark"])

    # rain cloud, but the house still stands and a window is still lit --
    # a hard chapter, not a verdict on the person.
    c.circle(50, 20, 10, P["sage_dark"])
    c.circle(66, 20, 12, P["sage_dark"])
    c.circle(82, 22, 9, P["sage_dark"])
    c.rect(44, 20, 90, 28, P["sage_dark"])
    for rx in (48, 60, 74, 86):
        c.rect(rx, 32, rx + 1, 37, P["sky"])

    house(c, 36, 100, 56, 40, 16, P["brown_light"], P["brown_dark"], lit=True)
    # a couple of bills at the door, not a person struggling
    c.rect(20, 108, 30, 118, P["cream_light"])
    c.rect(22, 110, 28, 112, P["coral"])
    c.rect(14, 112, 24, 122, P["cream_light"])
    c.rect(16, 114, 22, 116, P["coral"])

    c.auto_outline(OUTLINE)
    return c


SCENES = {
    "welcome_bg": welcome_bg,
    "ending_stable": ending_stable,
    "ending_scraping": ending_scraping,
    "ending_debt": ending_debt,
}


def main() -> None:
    for name, builder in SCENES.items():
        canvas = builder()
        saved = canvas.save(OUT_DIR / f"{name}.png")
        canvas.save_preview(PREVIEW_DIR / f"{name}_preview.png", scale=4)
        print(f"{name}: {saved}  ({canvas.width}x{canvas.height})")


if __name__ == "__main__":
    main()
