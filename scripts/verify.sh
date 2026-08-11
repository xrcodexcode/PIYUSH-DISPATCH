#!/usr/bin/env bash
set -e

echo "=== Running Linter ==="
npm run lint

echo "=== Running Build ==="
npm run build

echo "=== Verification Successful ==="
