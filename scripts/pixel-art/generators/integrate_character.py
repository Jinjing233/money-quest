"""Final Art Integration -- generic per-character version of
integrate_graduate_v2.py (see that file's docstring for the full
rationale: lossless-crop only, no drawing, same idle frame used for
every mood/frame slot since these are turnaround sets, not expression
sheets).

Usage:
    python integrate_character.py <character_id> <front_frame_index>

e.g.
    python integrate_character.py student 0
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parents[3]
MOODS = ("happy", "normal", "stressed", "exhausted")
FRAMES = (0, 1)


def main(character_id: str, front_frame_index: int) -> None:
    src_dir = PROJECT_ROOT / "scripts" / "pixel-art" / "pixellab_src" / "characters" / character_id
    char_dir = PROJECT_ROOT / "public" / "assets" / "pixel" / "characters"
    directions_out = char_dir / f"{character_id}_directions"

    frames = [Image.open(src_dir / f"frame_{i}.png").convert("RGBA") for i in range(8)]

    x0s, y0s, x1s, y1s = [], [], [], []
    for f in frames:
        bbox = f.getbbox()
        x0s.append(bbox[0]); y0s.append(bbox[1]); x1s.append(bbox[2]); y1s.append(bbox[3])
    union_box = (min(x0s), min(y0s), max(x1s), max(y1s))
    print("union bbox (lossless crop rect):", union_box)

    directions_out.mkdir(parents=True, exist_ok=True)
    cropped = []
    for i, f in enumerate(frames):
        c = f.crop(union_box)
        c.save(directions_out / f"frame_{i}.png")
        cropped.append(c)
    print(f"staged 8 direction frames -> {directions_out} (not wired into any component)")

    idle = cropped[front_frame_index]
    idle.save(char_dir / f"character_{character_id}_portrait.png")
    for mood in MOODS:
        for frame_n in FRAMES:
            idle.save(char_dir / f"character_{character_id}_{mood}_{frame_n}.png")
    print(f"replaced character_{character_id}_portrait.png and all 8 mood/frame sprites with the idle frame")
    print("size:", idle.size)


if __name__ == "__main__":
    main(sys.argv[1], int(sys.argv[2]))
