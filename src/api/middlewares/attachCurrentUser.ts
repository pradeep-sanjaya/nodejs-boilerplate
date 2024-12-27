import { Container } from 'typedi';
import { Logger } from 'winston';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '@/interfaces/IUser';

interface ITokenUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface RequestWithUser extends Request {
  token: ITokenUser;
  currentUser: IUser;
}

/**
 * Attach user to req.currentUser
 * @param {Request} req Express req Object
 * @param {Response} res  Express res Object
 * @param {NextFunction} next  Express next Function
 */
const attachCurrentUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const logger: Logger = Container.get('logger');
  try {
    // Since we removed MongoDB, we'll just pass the token user data
    // You should implement your own user retrieval logic here
    const currentUser = {
      ...req.token,
      password: '', // Empty string since we don't store password in token
      salt: '',     // Empty string since we don't store salt in token
    } as IUser;

    req.currentUser = currentUser;
    return next();
  } catch (e) {
    logger.error(' Error attaching user to req: %o', e);
    return next(e);
  }
};

export default attachCurrentUser;
