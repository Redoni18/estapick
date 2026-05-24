import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const defaultTestDatabaseUrl =
  'postgresql://postgres:postgres@localhost:5432/estapick_test';

export default function globalSetup(): void {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL =
    process.env.TEST_DATABASE_URL ?? defaultTestDatabaseUrl;
  process.env.SWAGGER_ENABLED = 'false';
  // Disable throttling globally so the existing suite is unaffected.
  // The dedicated throttling spec re-enables it via env overrides.
  process.env.THROTTLE_ENABLED ??= 'false';

  execSync('npx prisma db push --skip-generate --force-reset', {
    cwd: resolve(__dirname, '..'),
    env: { ...process.env },
    stdio: 'inherit',
  });
}
