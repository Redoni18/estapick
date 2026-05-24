import * as Joi from 'joi';

export interface AppConfig {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  databaseUrl: string;
  swaggerEnabled: boolean;
  throttleEnabled: boolean;
  throttleReadTtl: number;
  throttleReadLimit: number;
  throttleWriteTtl: number;
  throttleWriteLimit: number;
}

const parseIntEnv = (value: string | undefined, fallback: number): number => {
  const parsed = parseInt(value ?? '', 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const configuration = (): AppConfig => ({
  nodeEnv: (process.env.NODE_ENV as AppConfig['nodeEnv']) ?? 'development',
  port: parseInt(process.env.PORT ?? '3001', 10),
  databaseUrl:
    process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@localhost:5432/estapick',
  swaggerEnabled:
    (process.env.SWAGGER_ENABLED ?? 'true').toLowerCase() === 'true',
  throttleEnabled:
    (process.env.THROTTLE_ENABLED ?? 'true').toLowerCase() === 'true',
  throttleReadTtl: parseIntEnv(process.env.THROTTLE_READ_TTL, 60),
  throttleReadLimit: parseIntEnv(process.env.THROTTLE_READ_LIMIT, 120),
  throttleWriteTtl: parseIntEnv(process.env.THROTTLE_WRITE_TTL, 60),
  throttleWriteLimit: parseIntEnv(process.env.THROTTLE_WRITE_LIMIT, 10),
});

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().integer().min(1).max(65535).default(3001),
  DATABASE_URL: Joi.string().min(1).required(),
  SWAGGER_ENABLED: Joi.string().valid('true', 'false').default('true'),
  THROTTLE_ENABLED: Joi.string().valid('true', 'false').default('true'),
  THROTTLE_READ_TTL: Joi.number().integer().min(1).default(60),
  THROTTLE_READ_LIMIT: Joi.number().integer().min(1).default(120),
  THROTTLE_WRITE_TTL: Joi.number().integer().min(1).default(60),
  THROTTLE_WRITE_LIMIT: Joi.number().integer().min(1).default(10),
});
