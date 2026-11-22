# Money Quest — Pixel Art Style Guide

Cozy, warm, life-sim pixel art for a personal-finance game, aimed at
young adults living independently for the first time. Reference feel:
Stardew Valley's warm domestic cuteness — never copy its (or any other
game's) actual assets.

The guide and the tooling in `scripts/pixel-art/` are kept in sync —
`palette.py` is the source of truth for colors, this file is the
human-readable reference.

## Canvas sizes (native resolution, no exceptions)

| Category   | Size(s)                | Folder                            |
|------------|--------------------------|------------------------------------|
| Characters | 32×32 sprite, 64×64 portrait | `public/assets/pixel/characters/` |
| Items      | 16×16 or 32×32            | `public/assets/pixel/items/`       |
| Environment| 32×32, 32×64 or 64×64     | `public/assets/pixel/environment/` |
| UI icons   | 16×16 or 24×24            | `public/assets/pixel/ui/`          |

Assets are drawn at native resolution — never draw large and downscale.

## Palette

One shared palette (`scripts/pixel-art/palette.py`, dict `PALETTE`),
deliberately built to match the app's own Tailwind theme
(`src/index.css` `@theme`) so pixel assets sit inside the existing
cream/sage/brown UI chrome without clashing.

| Name        | Hex       | Matches app theme | Use                              |
|-------------|-----------|--------------------|-----------------------------------|
| brown_dark  | `#4A3626` | `--color-brown-dark` | outlines, deepest shadow        |
| brown       | `#6B4F3B` | `--color-brown`      | wood, hair, borders              |
| brown_light | `#A9835F` | `--color-brown-light`| light wood, hair highlight       |
| cream       | `#F3E3B3` | `--color-cream`      | walls, paper, backgrounds        |
| cream_light | `#FAF1D8` | `--color-cream-light` | lightest highlight, linens      |
| sage        | `#8FA878` | `--color-sage`       | plants, soft green accents       |
| sage_dark   | `#5F7A4E` | `--color-sage-dark`  | green shadow                     |
| sky         | `#6FA8DC` | `--color-energy`     | soft blue clothing/accents       |
| sky_dark    | `#4C7FB0` | (derived)            | blue shadow                      |
| coral       | `#D97757` | `--color-stress`     | light orange/red accents         |
| coral_dark  | `#B85A3E` | (derived)            | coral shadow                     |
| skin        | `#E8B887` | (derived)            | warm skin tone                   |
| skin_light  | `#F6D9A8` | (derived)            | skin highlight                   |
| gold        | `#E8C84B` | (derived)            | coins / money                    |
| gold_dark   | `#B88F2E` | (derived)            | coin shadow/rim                  |

Stay inside this palette. If a new asset genuinely needs a color
nothing here covers, add it to `palette.py` first, not just to one
sprite.

## Rules

1. **Hard edges only.** No antialiasing, no gradients, no blur. Every
   pixel is a flat, intentional color from the palette above.
2. **Transparent background.** Export RGBA PNGs; alpha 0 outside the
   shape, not white or checkerboard. Display with
   `image-rendering: pixelated` (the app's `.pixel-img` utility class
   in `src/index.css`) — never let the browser smooth-scale them.
3. **Exact sizes.** An asset's canvas must match the table above
   exactly; `scripts/pixel-art/validate.py` enforces this per folder.
4. **No copying.** Don't trace, palette-swap, or lightly edit art from
   existing games or asset packs. Everything is drawn from scratch.
5. **One outline weight.** A 1px `brown_dark` outline around the
   silhouette, added last via `PixelCanvas.auto_outline()` so it
   traces the finished shape regardless of complexity.
6. **Light source: upper-left.** Highlights upper-left, shadows
   lower-right, consistently across all assets.
7. **Naming:** `snake_case`, descriptive, in the right category
   folder: `coin_gold.png`, `character_graduate.png`,
   `character_graduate_portrait.png`, `bed.png`. Animation frames (if
   ever needed): `<name>_<action>_00.png`, `_01.png`, ... packed with
   `pack_sheet()` as `<name>_sheet.png`.

## Tooling

See [`scripts/pixel-art/README.md`](../../scripts/pixel-art/README.md).
Short version:

```powershell
python scripts/pixel-art/generators/characters.py   # 3 playable characters + portraits
python scripts/pixel-art/generators/environment.py  # apartment furniture set
python scripts/pixel-art/generators/ui_icons.py      # 16x16 finance/status icons
python scripts/pixel-art/validate.py                 # checks size / alpha / file integrity
```
