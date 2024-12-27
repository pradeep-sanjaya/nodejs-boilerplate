import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const config = {
  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT || '3000', 10),

  /**
   * That long string from your jwt secret
   */
  jwtSecret: process.env.JWT_SECRET || 'my-super-secret-jwt-token-with-at-least-32-characters-long',
  jwtAlgorithm: process.env.JWT_ALGO || 'HS256',

  /**
   * Your secret sauce
   */
  databaseURL: process.env.MONGODB_URI,

  /**
   * Used by winston logger
   */
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY || '20', 10),
  },

  /**
   * Agendash config
   */
  agendash: {
    user: 'agendash',
    password: '123456'
  },
  /**
   * API configs
   */
  emails: {
    apiKey: process.env.MAILGUN_API_KEY,
    apiUsername: process.env.MAILGUN_USERNAME,
    domain: process.env.MAILGUN_DOMAIN
  },
  /**
   * Storage configs
   */
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local',
    localRoot: process.env.STORAGE_LOCAL_ROOT || 'storage',
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      region: process.env.AWS_REGION || '',
      bucket: process.env.AWS_BUCKET || '',
    },
  },
};

export default config;
