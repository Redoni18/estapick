#!/bin/sh
set -e

echo "Applying database schema..."
npx prisma db push --skip-generate

echo "Seeding database..."
node dist/prisma/seed.js

echo "Starting API server..."
exec node dist/src/main.js
