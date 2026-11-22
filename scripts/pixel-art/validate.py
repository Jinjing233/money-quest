"""Validate pixel-art assets: output size, transparent background, and
file integrity.

Usage:
    python validate.py                              # scan public/assets/pixel
    python validate.py path/to/one_asset.png
    python validate.py path/to/a/folder

Exit code is 0 if every scanned file passes, 1 otherwise.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

DEFAULT_ROOT = Path(__file__).resolve().parents[2] / "public" / "assets" / "pixel"

# Folder name (under public/assets/pixel/) -> allowed pixel sizes.
EXPECTED_SIZES: dict[str, set[tuple[int, int]]] = {
    "characters": {(32, 32), (64, 64)},
    "items": {(16, 16), (32, 32)},
    "environment": {(32, 32), (32, 64), (64, 64)},
    "ui": {(16, 16), (24, 24)},
    # "scenes" is intentionally absent: one-off hero illustrations
    # (welcome background, ending art) are bespoke compositions, not a
    # repeated small-asset family, so their size isn't constrained.
}

# Folders allowed to be fully opaque -- full-bleed scene illustrations,
# unlike sprites/icons/furniture, are meant to fill their frame rather
# than float with a transparent cutout.
OPAQUE_OK = {"scenes", "patterns"}


def validate_file(path: Path) -> list[str]:
    errors: list[str] = []

    try:
        with Image.open(path) as img:
            img.verify()
    except Exception as e:  # noqa: BLE001 - report any decode failure
        return [f"invalid or corrupt PNG: {e}"]

    with Image.open(path) as img:
        if img.format != "PNG":
            errors.append(f"not a PNG (format={img.format})")

        if img.mode != "RGBA":
            errors.append(f"no alpha channel (mode={img.mode}, expected RGBA)")
        category = path.parent.name

        if img.mode == "RGBA" and category not in OPAQUE_OK:
            alpha_extrema = img.getchannel("A").getextrema()
            if alpha_extrema == (255, 255):
                errors.append("background is fully opaque (no transparency found)")

        allowed = EXPECTED_SIZES.get(category)
        if allowed and img.size not in allowed:
            sizes = ", ".join(f"{w}x{h}" for w, h in sorted(allowed))
            errors.append(f"unexpected size {img.size[0]}x{img.size[1]} for '{category}/' (expected {sizes})")

    return errors


def main(argv: list[str]) -> int:
    root = Path(argv[1]) if len(argv) > 1 else DEFAULT_ROOT

    if root.is_file():
        paths = [root]
    elif root.is_dir():
        paths = sorted(root.rglob("*.png"))
    else:
        print(f"no such file or directory: {root}")
        return 1

    if not paths:
        print(f"no PNG files found under {root}")
        return 0

    failed = 0
    for p in paths:
        errors = validate_file(p)
        if errors:
            failed += 1
            print(f"[FAIL] {p}")
            for e in errors:
                print(f"       - {e}")
        else:
            with Image.open(p) as img:
                print(f"[OK]   {p}  {img.size[0]}x{img.size[1]}  {img.mode}")

    print(f"\n{len(paths) - failed}/{len(paths)} passed")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
