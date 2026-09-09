#!/usr/bin/env bash
# Start OpenNext preview, run endpoint tests, capture sample JSON, then stop.
set -u
cd /home/z/my-project/myip
B=http://127.0.0.1:8787
LOG=/home/z/my-project/preview.log

# clean any stale port user
pkill -f "wrangler dev" 2>/dev/null; pkill -f "opennextjs-cloudflare" 2>/dev/null; sleep 1

env WRANGLER_SEND_METRICS=false npx opennextjs-cloudflare preview > "$LOG" 2>&1 &
SRV=$!
echo "server pid: $SRV"

UP=0
for i in $(seq 1 40); do
  sleep 2
  if curl -s --max-time 3 $B/api/v1/health > /tmp/h.json 2>/dev/null; then UP=1; echo "UP after $((i*2))s"; break; fi
done
if [ "$UP" != "1" ]; then echo "SERVER FAILED TO START"; tail -20 "$LOG"; kill $SRV 2>/dev/null; exit 1; fi

echo; echo "=== /api/v1/health ==="; cat /tmp/h.json; echo
echo "=== HOME <title> ==="; curl -s --max-time 30 $B/ | grep -o "<title>[^<]*</title>" | head -1
echo "=== HOME size ==="; curl -s --max-time 30 $B/ | wc -c
echo "=== /api/v1/ip (caller) ==="; curl -s --max-time 40 $B/api/v1/ip | head -c 700; echo
echo "=== /api/v1/ip/8.8.8.8 → docs/sample-response.json ==="
curl -s --max-time 40 $B/api/v1/ip/8.8.8.8 > docs/sample-response.json
python3 - <<'EOF'
import json
d = json.load(open('docs/sample-response.json'))
print("keys:", sorted(d.keys())[:22])
print("ip:", d.get("ip"), "| country:", d.get("country_name") or d.get("country"), "| sources ok:", d.get("sources_ok") or d.get("sources"))
EOF
echo "=== /api/v1/dnsbl/8.8.8.8 ==="; curl -s --max-time 45 $B/api/v1/dnsbl/8.8.8.8 | head -c 600; echo
echo "=== /api/v1/headers ==="; curl -s --max-time 15 -H "User-Agent: myip-test/1.0" $B/api/v1/headers | head -c 400; echo
echo "=== IPv6 lookup /api/v1/ip/2606:4700:4700::1111 ==="; curl -s --max-time 40 "$B/api/v1/ip/2606:4700:4700::1111" | head -c 400; echo
echo "=== bad input ==="; curl -s --max-time 15 "$B/api/v1/ip/not-an-ip" | head -c 200; echo
echo "=== STATIC ASSETS ==="
for p in /robots.txt /sitemap.xml /favicon.svg /manifest.webmanifest /og-image.png /icon-192.png /logo.svg /apple-touch-icon.png; do
  code=$(curl -s -o /dev/null -w "%{http_code} %{content_type}" --max-time 10 $B$p)
  echo "$p → $code"
done

echo; echo "stopping server..."
kill $SRV 2>/dev/null
sleep 2
pkill -f "wrangler" 2>/dev/null
echo "DONE"
