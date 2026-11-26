#!/bin/bash
# Take StatAtlas screenshots with headless Chrome, convert PNG -> JPEG (quality 82).
set -e
W=/home/hatch/workspace/makefun/new-2026-11-26/team11/national-statistics-site
CH=/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome
PORT=8080
cd "$W"
node serve.ts --port $PORT > /tmp/statatlas-serve.log 2>&1 &
SRV=$!
trap 'kill $SRV 2>/dev/null || true' EXIT
sleep 1
shot() {
  local file="$1" path="$2" w="$3" h="$4"
  "$CH" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=${w},${h} --virtual-time-budget=6000 \
    --screenshot="/tmp/statatlas-$file.png" "http://127.0.0.1:${PORT}/$path" 2>/dev/null
  python3 -c "
from PIL import Image
im = Image.open('/tmp/statatlas-$file.png').convert('RGB')
im.save('$W/screenshots/$file', 'JPEG', quality=82)
print('$file', im.size, __import__('os').path.getsize('$W/screenshots/$file'), 'bytes')
"
}
shot 1-home.jpg '#/' 1280 800
shot 2-country.jpg '#/country/idn' 1280 800
shot 3-compare.jpg '#/compare?a=idn&b=ind&c=nga' 1280 800
shot 4-phone.jpg '#/country/jpn' 390 844
ls -la "$W/screenshots/"
