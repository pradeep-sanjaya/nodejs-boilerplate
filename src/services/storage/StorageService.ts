import { Service } from 'typedi';
import { IStorageProvider } from '../../interfaces/IStorageProvider';
import { LocalStorageProvider } from './providers/LocalStorageProvider';
import { S3StorageProvider } from './providers/S3StorageProvider';
import config from '../../config';
import logger from '../../loaders/logger';

@Service()
export default class StorageService implements IStorageProvider {
  private provider: IStorageProvider;

  constructor() {
    logger.info('StorageService constructor called');
    
    // Initialize the appropriate storage provider based on configuration
    switch (config.storage.provider) {
      case 's3':
        if (!config.storage.s3.accessKeyId || !config.storage.s3.secretAccessKey || !config.storage.s3.region || !config.storage.s3.bucket) {
          throw new Error('Missing S3 configuration. Please check your environment variables.');
        }
        logger.info('Initializing S3 storage provider');
        this.provider = new S3StorageProvider(config.storage.s3);
        break;
      case 'local':
      default:
        logger.info('Initializing local storage provider');
        this.provider = new LocalStorageProvider(config.storage.localRoot);
        break;
    }
    
    logger.info('StorageService initialized with provider:', config.storage.provider);
  }

  async put(location: string, content: string | Buffer): Promise<void> {
    logger.info('StorageService.put called with location:', location);
    return this.provider.put(location, content);
  }

  async get(location: string): Promise<Buffer> {
    logger.info('StorageService.get called with location:', location);
    return this.provider.get(location);
  }

  async exists(location: string): Promise<boolean> {
    logger.info('StorageService.exists called with location:', location);
    return this.provider.exists(location);
  }

  async delete(location: string): Promise<void> {
    logger.info('StorageService.delete called with location:', location);
    return this.provider.delete(location);
  }

  async copy(src: string, dest: string): Promise<void> {
    logger.info('StorageService.copy called with src:', src, 'dest:', dest);
    return this.provider.copy(src, dest);
  }

  async move(src: string, dest: string): Promise<void> {
    logger.info('StorageService.move called with src:', src, 'dest:', dest);
    return this.provider.move(src, dest);
  }
}
