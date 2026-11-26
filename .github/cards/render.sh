#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
out="$(cd ../../assets/projects && pwd)"
session="profile-cards"
trap 'agent-browser --session "$session" close >/dev/null 2>&1 || true' EXIT

agent-browser --session "$session" set viewport 600 500 2 >/dev/null
for project in semiglobe jgs-store hifi-guard jaret-es; do
  for scheme in light dark; do
    agent-browser --session "$session" open "file://$PWD/index.html?p=$project&scheme=$scheme" >/dev/null
    agent-browser --session "$session" wait --load networkidle >/dev/null
    agent-browser --session "$session" screenshot "$out/$project-$scheme.png" >/dev/null
    sips -s format jpeg -s formatOptions 88 "$out/$project-$scheme.png" --out "$out/$project-$scheme.jpg" >/dev/null
    rm "$out/$project-$scheme.png"
    echo "assets/projects/$project-$scheme.jpg"
  done
done
