import { Router } from 'express';
import { isAuth, attachCurrentUser } from '../middlewares';

const route = Router();

const userRouter = (app: Router): void => {
  app.use('/users', route);

  route.get('/me', 
    isAuth, 
    attachCurrentUser, 
    (req, res) => {
      return res.json({ user: req.currentUser }).status(200);
    }
  );
};

export default userRouter;
