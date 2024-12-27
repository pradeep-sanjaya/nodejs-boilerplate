import { IStorageProvider } from '../../../interfaces/IStorageProvider';
import logger from '../../../loaders/logger';
import path from 'path';
import fs from 'fs';

export class LocalStorageProvider implements IStorageProvider {
  private uploadDir: string;

  constructor(uploadDir: string) {
    this.uploadDir = path.resolve(process.cwd(), uploadDir);
    logger.info('Initializing LocalStorageProvider with root:', this.uploadDir);

    // Create storage directory if it doesn't exist
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async put(location: string, content: string | Buffer): Promise<void> {
    logger.info('Putting file:', location);
    try {
      const filePath = path.join(this.uploadDir, location);
      await fs.promises.writeFile(filePath, content);
      logger.info('File put successfully:', location);
    } catch (error) {
      logger.error('Error putting file:', error);
      throw error;
    }
  }

  async get(location: string): Promise<Buffer> {
    logger.info('Getting file:', location);
    try {
      const filePath = path.join(this.uploadDir, location);
      const content = await fs.promises.readFile(filePath);
      logger.info('File retrieved successfully:', location);
      return content;
    } catch (error) {
      logger.error('Error getting file:', error);
      throw error;
    }
  }

  async exists(location: string): Promise<boolean> {
    logger.info('Checking if file exists:', location);
    try {
      const filePath = path.join(this.uploadDir, location);
      const exists = fs.existsSync(filePath);
      logger.info('File exists check result:', exists);
      return exists;
    } catch (error) {
      logger.error('Error checking file existence:', error);
      throw error;
    }
  }

  async delete(location: string): Promise<void> {
    logger.info('Deleting file:', location);
    try {
      const filePath = path.join(this.uploadDir, location);
      await fs.promises.unlink(filePath);
      logger.info('File deleted successfully:', location);
    } catch (error) {
      logger.error('Error deleting file:', error);
      throw error;
    }
  }

  async copy(src: string, dest: string): Promise<void> {
    logger.info('Copying file from', src, 'to', dest);
    try {
      const srcPath = path.join(this.uploadDir, src);
      const destPath = path.join(this.uploadDir, dest);
      await fs.promises.copyFile(srcPath, destPath);
      logger.info('File copied successfully');
    } catch (error) {
      logger.error('Error copying file:', error);
      throw error;
    }
  }

  async move(src: string, dest: string): Promise<void> {
    logger.info('Moving file from', src, 'to', dest);
    try {
      const srcPath = path.join(this.uploadDir, src);
      const destPath = path.join(this.uploadDir, dest);
      await fs.promises.rename(srcPath, destPath);
      logger.info('File moved successfully');
    } catch (error) {
      logger.error('Error moving file:', error);
      throw error;
    }
  }
}
