"""Build the standalone workstation and its downloadable ZIP using Python's standard library."""

import argparse
import base64
from pathlib import Path
import re
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[1]
FILENAME = "music-kit-studio.html"
MIME_TYPES = {".webp": "image/webp", ".ttf": "font/ttf", ".woff": "font/woff"}


def inline_asset(match):
    path = ROOT / match[1]
    data = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"url(data:{MIME_TYPES[path.suffix]};base64,{data})"


def build(output):
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    style = (ROOT / "style.css").read_text(encoding="utf-8")
    style = re.sub(r"url\((assets/[\w.-]+)\)", inline_asset, style)
    licenses = "\n".join(path.read_text(encoding="utf-8") for path in sorted((ROOT / "assets").glob("*-license.txt")))
    html = html.replace('<link rel="stylesheet" href="style.css">', f"<!--{licenses}-->\n<style>{style}</style>")
    scripts = []

    def inline_script(match):
        script = (ROOT / match[1]).read_text(encoding="utf-8").replace("</script", r"<\/script")
        scripts.append(f"<script>{script}</script>")
        return ""

    html = re.sub(r'<script src="([^"]+)" defer></script>', inline_script, html)
    html = html.replace("</body>", "".join(scripts) + "</body>")
    output.mkdir(parents=True, exist_ok=True)
    standalone = output / FILENAME
    standalone.write_bytes(html.encode("utf-8"))
    with ZipFile(output / "music-kit-studio.zip", "w", compression=ZIP_DEFLATED) as archive:
        archive.write(standalone, arcname=FILENAME)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output_directory", type=Path)
    build(parser.parse_args().output_directory)
