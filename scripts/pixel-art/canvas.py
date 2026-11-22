"""Low-resolution pixel canvas for Money Quest's cozy pixel art.

Draw directly on a small width x height grid of RGBA pixels (one grid
cell = one final PNG pixel), then export to a native-resolution PNG
with no antialiasing, plus an optional nearest-neighbor scaled-up
preview PNG for human inspection.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

from palette import TRANSPARENT, RGBA


class PixelCanvas:
    def __init__(self, width: int, height: int, background: RGBA = TRANSPARENT):
        self.width = width
        self.height = height
        self._pixels: list[list[RGBA]] = [[background] * width for _ in range(height)]

    # -- primitives ---------------------------------------------------

    def set(self, x: int, y: int, color: RGBA) -> None:
        if 0 <= x < self.width and 0 <= y < self.height:
            self._pixels[y][x] = color

    def get(self, x: int, y: int) -> RGBA:
        return self._pixels[y][x]

    def rect(self, x0: int, y0: int, x1: int, y1: int, color: RGBA, fill: bool = True) -> None:
        """Axis-aligned rectangle, inclusive of both corners."""
        x0, x1 = sorted((x0, x1))
        y0, y1 = sorted((y0, y1))
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                if fill or x in (x0, x1) or y in (y0, y1):
                    self.set(x, y, color)

    def recolor(self, x0: int, y0: int, x1: int, y1: int, from_color: RGBA, to_color: RGBA) -> None:
        """Repaint every pixel equal to from_color inside a rectangular
        region -- used to carve highlights/shadows/bangs out of a shape
        that was already filled, without touching the background."""
        x0, x1 = sorted((x0, x1))
        y0, y1 = sorted((y0, y1))
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                if self.get(x, y) == from_color:
                    self.set(x, y, to_color)

    def circle(self, cx: float, cy: float, radius: float, color: RGBA) -> None:
        """Blocky, non-antialiased filled disc."""
        r2 = radius * radius
        x0, x1 = int(cx - radius - 1), int(cx + radius + 1)
        y0, y1 = int(cy - radius - 1), int(cy + radius + 1)
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                dx, dy = x - cx + 0.5, y - cy + 0.5
                if dx * dx + dy * dy <= r2:
                    self.set(x, y, color)

    def auto_outline(self, color: RGBA, diagonal: bool = False) -> None:
        """Add a crisp 1px outline in `color` around whatever has been
        drawn so far: every fully-transparent pixel touching a
        non-transparent one becomes `color`. Run this last, after all
        fills, so it traces the finished silhouette."""
        neighbors = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        if diagonal:
            neighbors += [(-1, -1), (1, -1), (-1, 1), (1, 1)]
        to_outline: list[tuple[int, int]] = []
        for y in range(self.height):
            for x in range(self.width):
                if self._pixels[y][x][3] != 0:
                    continue
                for dx, dy in neighbors:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < self.width and 0 <= ny < self.height and self._pixels[ny][nx][3] != 0:
                        to_outline.append((x, y))
                        break
        for x, y in to_outline:
            self._pixels[y][x] = color

    # -- export ---------------------------------------------------------

    def to_image(self) -> Image.Image:
        img = Image.new("RGBA", (self.width, self.height))
        img.putdata([px for row in self._pixels for px in row])
        return img

    def save(self, path: str | Path) -> Path:
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        self.to_image().save(path, format="PNG")
        return path

    def save_preview(self, path: str | Path, scale: int = 8) -> Path:
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        img = self.to_image().resize(
            (self.width * scale, self.height * scale), resample=Image.NEAREST
        )
        img.save(path, format="PNG")
        return path


def make_portrait(
    image: Image.Image,
    box: tuple[int, int, int, int],
    scale: int,
    canvas_size: tuple[int, int],
) -> Image.Image:
    """Crop a region (e.g. the head+shoulders) out of an already-drawn
    sprite and nearest-neighbor upscale it into a bigger canvas, so a
    character-select portrait is guaranteed to be pixel-identical in
    style to its full sprite -- no separate drawing needed."""
    cropped = image.crop(box)
    scaled = cropped.resize((cropped.width * scale, cropped.height * scale), Image.NEAREST)
    out = Image.new("RGBA", canvas_size, TRANSPARENT)
    x = (canvas_size[0] - scaled.width) // 2
    y = (canvas_size[1] - scaled.height) // 2
    out.paste(scaled, (max(x, 0), max(y, 0)), scaled)
    return out


def pack_sheet(frames: list[Image.Image | PixelCanvas], columns: int | None = None) -> Image.Image:
    """Pack same-size frames into a grid sprite sheet."""
    images = [f.to_image() if isinstance(f, PixelCanvas) else f for f in frames]
    if not images:
        raise ValueError("pack_sheet needs at least one frame")
    w, h = images[0].size
    if any(im.size != (w, h) for im in images):
        raise ValueError("all frames in a sprite sheet must be the same size")
    columns = columns or len(images)
    rows = (len(images) + columns - 1) // columns
    sheet = Image.new("RGBA", (w * columns, h * rows), TRANSPARENT)
    for i, im in enumerate(images):
        x, y = (i % columns) * w, (i // columns) * h
        sheet.paste(im, (x, y), im)
    return sheet
