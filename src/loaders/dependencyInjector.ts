import { Container } from 'typedi';
import logger from './logger';

interface DependencyInjectorProps {
  mongoConnection: any;
  models: Array<{ name: string; model: any }>;
  services: Array<any>;
}

const dependencyInjector = ({ mongoConnection, models, services }: DependencyInjectorProps) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    services.forEach(Service => {
      Container.set(Service);
    });

    if (mongoConnection) {
      Container.set('mongoConnection', mongoConnection);
    }
    Container.set('logger', logger);

    logger.info('✌️ Dependencies injected into container');

    return { agenda: null };
  } catch (e) {
    logger.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};

export default dependencyInjector;
