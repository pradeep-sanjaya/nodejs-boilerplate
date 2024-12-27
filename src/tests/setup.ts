import 'reflect-metadata';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.STORAGE_PROVIDER = 'local';
process.env.STORAGE_LOCAL_ROOT = 'test-storage';
process.env.AWS_ACCESS_KEY_ID = 'test-key';
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';
process.env.AWS_REGION = 'test-region';
process.env.AWS_BUCKET = 'test-bucket';
process.env.JWT_SECRET = 'test-secret';
process.env.LOG_LEVEL = 'error';

// Mock fs promises
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  unlink: jest.fn(),
  mkdir: jest.fn(),
}));

// Mock fs
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    unlink: jest.fn(),
    mkdir: jest.fn(),
  },
}));

// Mock the config module
const mockConfig = {
  port: 3000,
  logs: {
    level: 'error',
  },
  api: {
    prefix: '/api',
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER,
    localRoot: process.env.STORAGE_LOCAL_ROOT,
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_BUCKET,
    },
  },
};

jest.mock('../config', () => mockConfig);

export { mockConfig };
