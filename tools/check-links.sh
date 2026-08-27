#!/usr/bin/env bash
# Checks every external link in the guide and reports the ones that don't
# answer 200. Run it from the repo root:
#
#   ./tools/check-links.sh
#
# Needs plain outbound HTTPS. Some sandboxes and corporate proxies block
# docs.aws.amazon.com, in which case curl reports 000 for everything — that
# means "could not reach", not "link is dead". If you see all 000, run it
# from a machine with normal internet access before believing the result.

set -uo pipefail

cd "$(dirname "$0")/.." || exit 1

# Both the pages and the quiz explanations carry links; a dead source link in
# an explanation is exactly the one a student would click to check a claim.
# In the .js banks the HTML lives inside a JS string, so the quotes arrive
# backslash-escaped — match either form.
# Cada certificación vive en su propia carpeta; el índice de la raíz enlaza a
# todas. Se recorre el sitio entero en vez de listar rutas a mano, para que una
# certificación nueva quede cubierta sin tocar este script.
mapfile -t urls < <(
  grep -rhoE 'href=\\?"https://[^"\\]+' \
    --include='*.html' --include='quiz-data.js' \
    . 2>/dev/null |
  sed -E 's/^href=\\?"//' |
  sort -u
)

if [ "${#urls[@]}" -eq 0 ]; then
  echo "No external links found."
  exit 0
fi

echo "Checking ${#urls[@]} unique external links…"
echo

fail=0
unreachable=0
for u in "${urls[@]}"; do
  # curl already prints 000 via -w when it cannot connect, so don't append
  # another one on failure — that would produce "000000" and read as broken.
  code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 20 "$u")
  [ -z "$code" ] && code=000
  case "$code" in
    200) ;;
    000) printf '  ?? unreachable  %s\n' "$u"; unreachable=$((unreachable + 1)) ;;
    *)   printf '  !! %s          %s\n' "$code" "$u"; fail=$((fail + 1)) ;;
  esac
done

echo
echo "checked=${#urls[@]}  broken=${fail}  unreachable=${unreachable}"

if [ "$unreachable" -eq "${#urls[@]}" ]; then
  echo
  echo "Every link was unreachable — that points at network egress, not at the links."
  exit 2
fi

[ "$fail" -eq 0 ]
