#!/usr/bin/env bash
# Fails when the Payload collections have changed but no migration was created for the change
# (PRD §8.4). Dev push mode updates the local database silently, so without this check a schema
# change could reach staging with no migration. Run by CI; safe to run locally (it leaves no files).
set -euo pipefail
cd "$(dirname "$0")/../.."

dir=src/migrations
before=$(ls "$dir")
index_backup=$(mktemp)
cp "$dir/index.ts" "$index_backup"

# --skip-empty writes nothing when the schema matches the last migration.
pnpm -s payload migrate:create schema-check --skip-empty </dev/null >/dev/null

new=$(comm -13 <(echo "$before") <(ls "$dir"))
if [ -n "$new" ]; then
  # Remove the trial migration so the check never leaves files behind.
  for file in $new; do rm -f "$dir/$file"; done
  cp "$index_backup" "$dir/index.ts"
  rm -f "$index_backup"
  echo "The schema changed but there is no migration for it."
  echo "Create one with: pnpm migrate:create <short-name>, review it, and commit it."
  exit 1
fi
rm -f "$index_backup"
echo "Migrations match the schema."
