import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import file from './routes/file';

export default () => {
  const router = Router();
  auth(router);
  user(router);
  file(router);
  return router;
};