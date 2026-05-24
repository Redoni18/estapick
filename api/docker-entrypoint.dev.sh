#!/bin/sh
set -e

echo "Applying database schema..."
npx prisma db push

echo "Seeding database..."
npx prisma db seed

echo "Starting API dev server with hot reload..."
exec npm run start:dev
