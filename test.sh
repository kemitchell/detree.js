#!/bin/bash
set -e
for lamos in test/*.lamos; do
  npx -q lamos-to-json < "$lamos" > "$lamos.json"
done

for json in text/*.json; do
  npx -q ajv-cli validate -s schema.json -d "$json"
done
