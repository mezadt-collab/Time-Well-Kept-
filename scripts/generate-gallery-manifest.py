import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

WATCHES_DIR = ROOT / "images" / "watches"
MANIFEST_FILE = ROOT / "archive" / "gallery-manifest.json"

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".avif"
}

manifest = {}

if WATCHES_DIR.exists():

    for watch_folder in sorted(WATCHES_DIR.iterdir()):

        if not watch_folder.is_dir():
            continue

        images = []

        for image in sorted(
            watch_folder.iterdir(),
            key=lambda p: p.name.lower()
        ):

            if not image.is_file():
                continue

            if image.suffix.lower() not in IMAGE_EXTENSIONS:
                continue

            images.append(image.name)

        if images:
            manifest[watch_folder.name] = images


MANIFEST_FILE.parent.mkdir(
    parents=True,
    exist_ok=True
)

MANIFEST_FILE.write_text(
    json.dumps(
        manifest,
        indent=2,
        ensure_ascii=False
    ) + "\n",
    encoding="utf-8"
)

print(
    f"Gallery manifest generated for "
    f"{len(manifest)} watches."
)
