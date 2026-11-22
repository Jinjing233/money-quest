"""Money Quest cozy pixel-art palette.

Deliberately built to match the app's own Tailwind theme
(src/index.css @theme), so pixel assets sit inside the existing
cream/sage/brown UI chrome without clashing: `cream`, `sage`,
`sage_dark`, `brown`, `brown_dark`, `brown_light`, `sky` and `coral`
below are the *exact* hex values already used for `--color-cream`,
`--color-sage`, `--color-sage-dark`, `--color-brown`,
`--color-brown-dark`, `--color-brown-light`, `--color-energy` and
`--color-stress`. `sky_dark`, `coral_dark`, `skin`, `skin_light`,
`gold` and `gold_dark` are the only additions, needed for shading and
for things the UI theme has no color for (skin tones, coins).

Requested core hues: cream yellow, sage green, warm brown, soft blue,
light orange -- all present below, each with one shadow variant.

Single source of truth for color. docs/pixel-art/style-guide.md
documents the same table for humans.
"""

from __future__ import annotations

RGBA = tuple[int, int, int, int]

TRANSPARENT: RGBA = (0, 0, 0, 0)

PALETTE: dict[str, RGBA] = {
    "brown_dark":  (74, 54, 38, 255),    # --color-brown-dark: outlines, deepest shadow
    "brown":       (107, 79, 59, 255),   # --color-brown: wood, hair, borders
    "brown_light": (169, 131, 95, 255),  # --color-brown-light: light wood, hair highlight
    "cream":       (243, 227, 179, 255), # --color-cream: walls, paper, base background
    "cream_light": (250, 241, 216, 255), # --color-cream-light: lightest highlight, linens
    "sage":        (143, 168, 120, 255), # --color-sage: plants, soft green accents
    "sage_dark":   (95, 122, 78, 255),   # --color-sage-dark: green shadow
    "sky":         (111, 168, 220, 255), # --color-energy: soft blue clothing/accents
    "sky_dark":    (76, 127, 176, 255),  # soft blue shadow (derived, not in CSS theme)
    "coral":       (217, 119, 87, 255),  # --color-stress: light orange/red accents
    "coral_dark":  (184, 90, 62, 255),   # coral shadow (derived)
    "skin":        (232, 184, 135, 255), # warm skin tone (derived, not in CSS theme)
    "skin_light":  (246, 217, 168, 255), # skin highlight (derived)
    "gold":        (232, 200, 75, 255),  # coin / money (derived, not in CSS theme)
    "gold_dark":   (184, 143, 46, 255),  # coin shadow/rim (derived)
}


def hex_to_rgba(h: str, alpha: int = 255) -> RGBA:
    h = h.lstrip("#")
    r, g, b = (int(h[i : i + 2], 16) for i in (0, 2, 4))
    return (r, g, b, alpha)


def rgba_to_hex(c: RGBA) -> str:
    return "#{:02X}{:02X}{:02X}".format(*c[:3])


if __name__ == "__main__":
    for name, color in PALETTE.items():
        print(f"{name:12s} {rgba_to_hex(color)}  {color}")
