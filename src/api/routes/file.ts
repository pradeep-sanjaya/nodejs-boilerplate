import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import multer from 'multer';
import StorageService from '../../services/storage/StorageService';
import { celebrate, Joi } from 'celebrate';
import logger from '../../loaders/logger';

const route = Router();
const upload = multer({ storage: multer.memoryStorage() });

export default (app: Router) => {
  app.use('/files', route);

  route.post(
    '/upload',
    upload.single('file'),
    celebrate({
      body: Joi.object({
        // Add any additional fields you want to validate
      }),
    }),
    async (req: Request, res: Response) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
        }

        logger.info('Uploading file: ' + req.file.originalname);
        
        // Debug logging
        logger.info('Getting StorageService from container');
        const availableServices = Container.has(StorageService);
        logger.info('StorageService available:', availableServices);
        
        const storageService = Container.get(StorageService);
        logger.info('StorageService instance:', storageService);
        
        const filename = `${Date.now()}-${req.file.originalname}`;
        await storageService.put(filename, req.file.buffer);
        logger.info('File uploaded successfully: ' + filename);

        return res.status(201).json({
          message: 'File uploaded successfully',
          filename,
        });
      } catch (error) {
        logger.error('Error uploading file:', error);
        return res.status(500).json({ message: 'Error uploading file' });
      }
    }
  );

  route.get(
    '/:filename',
    celebrate({
      params: Joi.object({
        filename: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response) => {
      try {
        logger.info('Retrieving file: ' + req.params.filename);
        const storageService = Container.get(StorageService);
        
        // Debug logging
        logger.info('Getting StorageService from container');
        const availableServices = Container.has(StorageService);
        logger.info('StorageService available:', availableServices);
        
        logger.info('StorageService instance:', storageService);
        
        if (!await storageService.exists(req.params.filename)) {
          logger.error('File not found: ' + req.params.filename);
          return res.status(404).json({ message: 'File not found' });
        }
        
        const content = await storageService.get(req.params.filename);
        
        // You might want to set proper content type based on file type
        res.setHeader('Content-Type', 'application/octet-stream');
        logger.info('File retrieved successfully: ' + req.params.filename);
        return res.send(content);
      } catch (error) {
        logger.error('Error retrieving file:', error);
        return res.status(500).json({ message: 'Error retrieving file' });
      }
    }
  );

  route.delete(
    '/:filename',
    celebrate({
      params: Joi.object({
        filename: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response) => {
      try {
        logger.info('Deleting file: ' + req.params.filename);
        const storageService = Container.get(StorageService);
        
        // Debug logging
        logger.info('Getting StorageService from container');
        const availableServices = Container.has(StorageService);
        logger.info('StorageService available:', availableServices);
        
        logger.info('StorageService instance:', storageService);
        
        if (!await storageService.exists(req.params.filename)) {
          logger.error('File not found: ' + req.params.filename);
          return res.status(404).json({ message: 'File not found' });
        }
        
        await storageService.delete(req.params.filename);
        logger.info('File deleted successfully: ' + req.params.filename);
        return res.status(200).json({ message: 'File deleted successfully' });
      } catch (error) {
        logger.error('Error deleting file:', error);
        return res.status(500).json({ message: 'Error deleting file' });
      }
    }
  );
};