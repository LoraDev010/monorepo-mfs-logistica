#!/bin/bash
# Start all MFE dev servers
# MFEs use vite build + vite preview (required for @originjs/vite-plugin-federation)
# Shell uses vite dev
set -euo pipefail
cd /var/www/mf-user-test

# Kill any leftover vite processes
pkill -f vite 2>/dev/null || true
sleep 1

echo "[1/2] Building users-mfe..."
(cd apps/users-mfe && npx vite build 2>&1) | tail -4
echo "[2/2] Building countries-mfe..."
(cd apps/countries-mfe && npx vite build 2>&1) | tail -4

echo ""
echo "Starting users-mfe preview on port 5174..."
(cd apps/users-mfe && nohup npx vite preview --port 5174 --host 0.0.0.0 > /tmp/mfe.log 2>&1) &
echo "Starting countries-mfe preview on port 5175..."
(cd apps/countries-mfe && nohup npx vite preview --port 5175 --host 0.0.0.0 > /tmp/ctr.log 2>&1) &

echo "Waiting 3s for previews..."
sleep 3

echo "Starting shell dev server on port 5173..."
(cd apps/shell && nohup npx vite --port 5173 --host 0.0.0.0 > /tmp/sh.log 2>&1) &

echo "Waiting 5s for shell to start..."
sleep 5

echo ""
echo "=== Server URLs ==="
grep "Local:" /tmp/mfe.log /tmp/ctr.log /tmp/sh.log 2>/dev/null || echo "Some servers may still be starting..."
echo ""
echo "Open: http://localhost:5173"

# Keep container alive (wait for background processes)
wait
