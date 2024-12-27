import { Container } from 'typedi';
import request from 'supertest';
import express from 'express';
import fileRoutes from '../file';
import StorageService from '../../../services/storage/StorageService';
import { IStorageProvider } from '../../../interfaces/IStorageProvider';

describe('File Upload Routes', () => {
  let app: express.Application;
  let mockStorageService: jest.Mocked<IStorageProvider>;

  beforeEach(() => {
    // Create a new express app for each test
    app = express();
    app.use(express.json());

    // Create a mock storage service
    mockStorageService = {
      put: jest.fn(),
      get: jest.fn(),
      exists: jest.fn(),
      delete: jest.fn(),
      copy: jest.fn(),
      move: jest.fn(),
    };

    // Reset Container and register mock service
    Container.reset();
    Container.set(StorageService, mockStorageService);

    // Initialize routes
    const router = express.Router();
    fileRoutes(router);
    app.use('/api', router);
  });

  describe('POST /api/files/upload', () => {
    it('should upload file successfully', async () => {
      const testFile = Buffer.from('test file content');
      mockStorageService.put.mockResolvedValue();

      const response = await request(app)
        .post('/api/files/upload')
        .attach('file', testFile, 'test.txt');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'File uploaded successfully');
      expect(response.body).toHaveProperty('filename');
      expect(mockStorageService.put).toHaveBeenCalled();
    });

    it('should return 400 when no file is uploaded', async () => {
      const response = await request(app)
        .post('/api/files/upload')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'No file uploaded');
    });

    it('should handle storage service errors', async () => {
      const testFile = Buffer.from('test file content');
      mockStorageService.put.mockRejectedValue(new Error('Storage error'));

      const response = await request(app)
        .post('/api/files/upload')
        .attach('file', testFile, 'test.txt');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Error uploading file');
    });
  });

  describe('GET /api/files/:filename', () => {
    it('should download file successfully', async () => {
      const testFile = Buffer.from('test file content');
      mockStorageService.exists.mockResolvedValue(true);
      mockStorageService.get.mockResolvedValue(testFile);

      const response = await request(app)
        .get('/api/files/test.txt');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(Buffer.from('test file content'));
    });

    it('should return 404 when file does not exist', async () => {
      mockStorageService.exists.mockResolvedValue(false);

      const response = await request(app)
        .get('/api/files/nonexistent.txt');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'File not found');
    });
  });

  describe('DELETE /api/files/:filename', () => {
    it('should delete file successfully', async () => {
      mockStorageService.exists.mockResolvedValue(true);
      mockStorageService.delete.mockResolvedValue();

      const response = await request(app)
        .delete('/api/files/test.txt');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'File deleted successfully');
    });

    it('should return 404 when file does not exist', async () => {
      mockStorageService.exists.mockResolvedValue(false);

      const response = await request(app)
        .delete('/api/files/nonexistent.txt');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'File not found');
    });
  });
});
