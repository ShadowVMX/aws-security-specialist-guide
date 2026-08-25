#!/usr/bin/env bash
# Fails if any relative href/src in the HTML points at a file that isn't there.
# A dead internal link is a dead click for someone mid-study, and it is the
# kind of breakage that a rename introduces silently.

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

fail=0
checked=0

while IFS= read -r line; do
  file="${line%%:*}"
  ref="${line#*:}"
  ref="${ref#*\"}"
  ref="${ref%\"}"

  case "$ref" in
    http*|//*|mailto:*|\#*|data:*) continue ;;
  esac

  path="${ref%%#*}"
  path="${path%%\?*}"
  [ -z "$path" ] && continue

  target="$(dirname "$file")/$path"
  checked=$((checked + 1))
  if [ ! -e "$target" ]; then
    echo "  broken: $file -> $ref"
    fail=1
  fi
done < <(grep -rEo --include='*.html' '(href|src)="[^"]+"' . | grep -v '^\./\.git')

echo "internal links checked: $checked"
[ "$fail" -eq 0 ] && echo "all internal links resolve"
exit $fail
