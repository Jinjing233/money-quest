# Pixel art tools

Reusable Python + Pillow helpers for drawing Money Quest's pixel-art
assets at native resolution, with no antialiasing. See
[`docs/pixel-art/style-guide.md`](../../docs/pixel-art/style-guide.md)
for the art spec (sizes, palette, rules) this tooling enforces.

Requires `Pillow` (`pip install Pillow`).

## Files

- `palette.py` — the shared palette (`PALETTE` dict), matched to the
  app's own Tailwind theme colors (`src/index.css`).
- `canvas.py` — `PixelCanvas`: draw on a small pixel grid (`set`,
  `rect`, `circle`, `recolor`, `auto_outline`), then `save()` a
  native-res PNG and `save_preview()` an upscaled nearest-neighbor PNG
  for checking the pixels stay crisp. Also `make_portrait()` (crop +
  upscale a sprite into a bigger select-screen portrait) and
  `pack_sheet()` (combine equal-size frames into a sprite sheet).
- `validate.py` — checks PNG validity, RGBA transparency, and that an
  asset's size matches its category (`characters/` 32×32 or 64×64,
  `items/` 16×16 or 32×32, `environment/` 32×32/32×64/64×64, `ui/`
  16×16 or 24×24).
- `generators/` — one script per asset family:
  - `characters.py` — the 3 playable characters (sprite + portrait
    each), one shared `draw_character()` parameterized by hair/outfit
    colors so all three stay stylistically identical.
  - `environment.py` — the apartment furniture set (bed, desk, chair,
    lamp, window, plant, cabinet, rug, wall art).
  - `ui_icons.py` — the 7 finance/status icons (coin, stress, energy,
    income, expense, bill, savings).
- `previews/` — upscaled nearest-neighbor PNGs for visual inspection.
  Not game assets — never reference these from game code.

## Workflow for a new or edited asset

1. Add a function to the relevant `generators/*.py` (or a new file for
   a new asset family), drawing with `PixelCanvas` using only colors
   from `palette.PALETTE`.
2. `canvas.save("public/assets/pixel/<category>/<name>.png")`
3. `canvas.save_preview("scripts/pixel-art/previews/<name>_preview.png")`
   and look at it — check edges are crisp and nothing is blurred.
4. `python scripts/pixel-art/validate.py` to confirm size, transparency
   and file integrity.
5. To tweak an existing asset, edit its function and re-run the
   generator — don't hand-edit the PNG.
