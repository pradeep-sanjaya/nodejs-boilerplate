import { Container } from 'typedi';
import { Logger } from 'winston';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '@/interfaces/IUser';
import { ITokenUser } from '@/types/express';

/**
 * Attach user to req.currentUser
 * @param {Request} req Express req Object
 * @param {Response} res Express res Object
 * @param {NextFunction} next Express next Function
 */
const attachCurrentUser = async (req: Request & { token: ITokenUser }, res: Response, next: NextFunction) => {
  const logger: Logger = Container.get('logger');
  try {
    const currentUser: IUser = {
      _id: req.token._id,
      name: req.token.name,
      email: req.token.email,
      role: req.token.role,
      password: '', // Empty string since we don't store password in token
      salt: '',     // Empty string since we don't store salt in token
    };

    (req as Request & { currentUser: IUser }).currentUser = currentUser;
    return next();
  } catch (e) {
    logger.error(' Error attaching user to req: %o', e);
    return next(e);
  }
};

export default attachCurrentUser;
