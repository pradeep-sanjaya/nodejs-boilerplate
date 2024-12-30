import { Router, Response, Request } from 'express';
import { isAuth, attachCurrentUser } from '../middlewares';
import { IUser } from '@/interfaces/IUser';

const route = Router();

const userRouter = (app: Router): void => {
  app.use('/users', route);

  route.get('/me', 
    isAuth, 
    attachCurrentUser, 
    (req: Request & { currentUser: IUser }, res: Response) => {
      return res.json({ user: req.currentUser }).status(200);
    }
  );
};

export default userRouter;
