import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import logger from './logger';
import { Container } from 'typedi';
import StorageService from '../services/storage/StorageService';

export default async ({ expressApp }) => {
  logger.info('Loading dependencies...');

  // Explicitly register StorageService
  Container.set(StorageService, new StorageService());
  logger.info('StorageService registered');

  // It returns the agenda instance because it's needed in the subsequent loaders
  await dependencyInjectorLoader({
    mongoConnection: null,
    models: [],
    services: [],
  });
  logger.info('✌️ Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  logger.info('✌️ Express loaded');
};
