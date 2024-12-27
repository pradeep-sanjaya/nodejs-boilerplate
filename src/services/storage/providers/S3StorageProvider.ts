import { IStorageProvider } from '../../../interfaces/IStorageProvider';
import logger from '../../../loaders/logger';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import {
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';

export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
}

export class S3StorageProvider implements IStorageProvider {
  private client: S3Client;
  private bucket: string;

  constructor(config: S3Config) {
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    this.bucket = config.bucket;
    logger.info('Initializing S3StorageProvider with bucket:', this.bucket);
  }

  async put(location: string, content: string | Buffer): Promise<void> {
    logger.info('Putting file to S3:', location);
    try {
      const upload = new Upload({
        client: this.client,
        params: {
          Bucket: this.bucket,
          Key: location,
          Body: content,
        },
      });

      await upload.done();
      logger.info('File put successfully to S3:', location);
    } catch (error) {
      logger.error('Error putting file to S3:', error);
      throw error;
    }
  }

  async get(location: string): Promise<Buffer> {
    logger.info('Getting file from S3:', location);
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: location,
      });

      const response = await this.client.send(command);
      if (!response.Body) {
        throw new Error('Empty response body');
      }

      // Convert stream to buffer
      const chunks: Buffer[] = [];
      for await (const chunk of response.Body as any) {
        chunks.push(chunk);
      }
      const content = Buffer.concat(chunks);

      logger.info('File retrieved successfully from S3:', location);
      return content;
    } catch (error) {
      logger.error('Error getting file from S3:', error);
      throw error;
    }
  }

  async exists(location: string): Promise<boolean> {
    logger.info('Checking if file exists in S3:', location);
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: location,
      });

      try {
        await this.client.send(command);
        logger.info('File exists in S3:', location);
        return true;
      } catch (error: any) {
        if (error.name === 'NotFound') {
          logger.info('File does not exist in S3:', location);
          return false;
        }
        throw error;
      }
    } catch (error) {
      logger.error('Error checking file existence in S3:', error);
      throw error;
    }
  }

  async delete(location: string): Promise<void> {
    logger.info('Deleting file from S3:', location);
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: location,
      });

      await this.client.send(command);
      logger.info('File deleted successfully from S3:', location);
    } catch (error) {
      logger.error('Error deleting file from S3:', error);
      throw error;
    }
  }

  async copy(src: string, dest: string): Promise<void> {
    logger.info('Copying file in S3 from', src, 'to', dest);
    try {
      const command = new CopyObjectCommand({
        Bucket: this.bucket,
        CopySource: `${this.bucket}/${src}`,
        Key: dest,
      });

      await this.client.send(command);
      logger.info('File copied successfully in S3');
    } catch (error) {
      logger.error('Error copying file in S3:', error);
      throw error;
    }
  }

  async move(src: string, dest: string): Promise<void> {
    logger.info('Moving file in S3 from', src, 'to', dest);
    try {
      // Copy first, then delete the source
      await this.copy(src, dest);
      await this.delete(src);
      logger.info('File moved successfully in S3');
    } catch (error) {
      logger.error('Error moving file in S3:', error);
      throw error;
    }
  }
}
