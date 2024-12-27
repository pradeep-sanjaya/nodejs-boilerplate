import { Container } from 'typedi';
import StorageService from '../StorageService';
import { LocalStorageProvider } from '../providers/LocalStorageProvider';
import { S3StorageProvider } from '../providers/S3StorageProvider';
import fs from 'fs';
import path from 'path';
import { mockConfig } from '../../../tests/setup';
import { GetObjectCommand, S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

// Add custom matcher types
declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchCommand(expected: any): R;
    }
  }
}

jest.mock('fs');
jest.mock('fs/promises');

// Mock AWS SDK modules
jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/lib-storage');

// Custom matcher for AWS SDK commands
expect.extend({
  toMatchCommand(received: any, expected: any) {
    const pass = received instanceof expected.constructor &&
      received.input.Bucket === expected.input.Bucket &&
      received.input.Key === expected.input.Key;
    return {
      pass,
      message: () => `expected ${received} to match command ${expected}`,
    };
  },
});

describe('StorageService', () => {
  let storageService: StorageService;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    
    // Reset Container
    Container.reset();
  });

  describe('Local Storage Provider', () => {
    beforeEach(() => {
      mockConfig.storage.provider = 'local';
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      // Create a new instance for each test
      storageService = new StorageService();
    });

    it('should initialize with LocalStorageProvider', () => {
      expect(storageService['provider']).toBeInstanceOf(LocalStorageProvider);
    });

    it('should put file successfully', async () => {
      const filename = 'test.txt';
      const content = Buffer.from('test content');

      await storageService.put(filename, content);

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining(filename),
        content
      );
    });

    it('should get file successfully', async () => {
      const filename = 'test.txt';
      const mockContent = Buffer.from('test content');
      
      (fs.promises.readFile as jest.Mock).mockResolvedValue(mockContent);

      const result = await storageService.get(filename);

      expect(fs.promises.readFile).toHaveBeenCalledWith(
        expect.stringContaining(filename)
      );
      expect(result).toEqual(mockContent);
    });

    it('should check if file exists', async () => {
      const filename = 'test.txt';
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const exists = await storageService.exists(filename);

      expect(fs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining(filename)
      );
      expect(exists).toBe(true);
    });

    it('should delete file successfully', async () => {
      const filename = 'test.txt';

      await storageService.delete(filename);

      expect(fs.promises.unlink).toHaveBeenCalledWith(
        expect.stringContaining(filename)
      );
    });
  });

  describe('S3 Storage Provider', () => {
    let mockS3Send: jest.Mock;
    let mockUpload: jest.Mock;
    let mockUploadDone: jest.Mock;

    beforeEach(() => {
      // Setup S3 mocks
      mockS3Send = jest.fn();
      (S3Client as unknown as jest.Mock).mockImplementation(() => ({
        send: mockS3Send,
      }));

      // Setup Upload mock
      mockUploadDone = jest.fn().mockResolvedValue({});
      mockUpload = jest.fn().mockImplementation(() => ({
        done: mockUploadDone,
      }));
      (Upload as unknown as jest.Mock).mockImplementation(mockUpload);

      // Update config to use S3
      mockConfig.storage.provider = 's3';
      mockConfig.storage.s3.accessKeyId = 'test-key';
      mockConfig.storage.s3.secretAccessKey = 'test-secret';
      mockConfig.storage.s3.region = 'test-region';
      mockConfig.storage.s3.bucket = 'test-bucket';

      // Create a new instance with S3 config
      Container.reset();
      storageService = new StorageService();
    });

    it('should initialize with S3StorageProvider', () => {
      expect(storageService['provider']).toBeInstanceOf(S3StorageProvider);
      expect(S3Client).toHaveBeenCalledWith({
        region: mockConfig.storage.s3.region,
        credentials: {
          accessKeyId: mockConfig.storage.s3.accessKeyId,
          secretAccessKey: mockConfig.storage.s3.secretAccessKey,
        },
      });
    });

    it('should put file successfully', async () => {
      const filename = 'test.txt';
      const content = Buffer.from('test content');

      await storageService.put(filename, content);

      expect(mockUpload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: mockConfig.storage.s3.bucket,
          Key: filename,
          Body: content,
        },
      });
      expect(mockUploadDone).toHaveBeenCalled();
    });

    // it('should get file successfully', async () => {
    //   const filename = 'test.txt';
    //   const mockContent = Buffer.from('test content');

    //   // Mock S3 response with async iterable
    //   const mockStream = {
    //     async *[Symbol.asyncIterator]() {
    //       yield mockContent;
    //     },
    //   };

    //   mockS3Send.mockImplementation((command) => {
    //     if (command instanceof GetObjectCommand) {
    //       // Check command type
    //       expect(command).toBeInstanceOf(GetObjectCommand);
    //       expect(command.constructor.name).toBe('GetObjectCommand');
          
    //       // Verify command parameters
    //       const commandInput = (command as any).input;
    //       expect(commandInput).toBeDefined();
    //       expect(commandInput).toEqual({
    //         Bucket: mockConfig.storage.s3.bucket,
    //         Key: filename
    //       });
          
    //       return Promise.resolve({
    //         Body: mockStream,
    //         $metadata: { httpStatusCode: 200 },
    //       });
    //     }
    //     return Promise.reject(new Error('Unknown command'));
    //   });

    //   const result = await storageService.get(filename);
    //   expect(result).toEqual(mockContent);
    //   expect(mockS3Send).toHaveBeenCalledTimes(1);
    // });

    // it('should delete file successfully', async () => {
    //   const filename = 'test.txt';
    //   mockS3Send.mockImplementation((command) => {
    //     if (command instanceof DeleteObjectCommand) {
    //       // Check command type
    //       expect(command).toBeInstanceOf(DeleteObjectCommand);
    //       expect(command.constructor.name).toBe('DeleteObjectCommand');
          
    //       // Verify command parameters
    //       const commandInput = (command as any).input;
    //       expect(commandInput).toBeDefined();
    //       expect(commandInput).toEqual({
    //         Bucket: mockConfig.storage.s3.bucket,
    //         Key: filename
    //       });
          
    //       return Promise.resolve({
    //         $metadata: { httpStatusCode: 204 },
    //       });
    //     }
    //     return Promise.reject(new Error('Unknown command'));
    //   });

    //   await storageService.delete(filename);
    //   expect(mockS3Send).toHaveBeenCalledTimes(1);
    // });
  });
});
