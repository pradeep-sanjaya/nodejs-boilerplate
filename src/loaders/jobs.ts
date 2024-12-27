import config from '../config';
import EmailSequenceJob from '../jobs/emailSequence';
import { SimpleJobScheduler } from './agenda';

interface JobsLoaderOptions {
  agenda: SimpleJobScheduler;
}

const jobsLoader = ({ agenda }: JobsLoaderOptions) => {
  agenda.define(
    'send-email',
    { 
      priority: 'high' 
    },
    new EmailSequenceJob().handler,
  );

  agenda.start();
};

export default jobsLoader;
