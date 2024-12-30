import { Router, Router as ExpressRouter } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import AuthService from '../../services/auth';
import { attachCurrentUser, isAuth } from '../middlewares';
import { Logger } from 'winston';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post(
    '/signup',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req, res, next) => {
      const logger: Logger = Container.get('logger') as Logger;
      logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
      try {
        const authServiceInstance = Container.get(AuthService);
        const { user, token } = await authServiceInstance.SignUp(req.body);
        return res.status(201).json({ user, token });
      } catch (e) {
        logger.error('Error: %o', e);
        return next(e);
      }
    }
  );

  route.post(
    '/signin',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req, res, next) => {
      const logger: Logger = Container.get('logger') as Logger;
      logger.debug('Calling Sign-In endpoint with body: %o', req.body);
      try {
        const authServiceInstance = Container.get(AuthService);
        const { user, token } = await authServiceInstance.SignIn(req.body.email, req.body.password);
        return res.json({ user, token }).status(200);
      } catch (e) {
        logger.error('Error: %o', e);
        return next(e);
      }
    }
  );

  route.post(
    '/logout',
    isAuth,
    async (req, res, next) => {
      const logger: Logger = Container.get('logger') as Logger;
      logger.debug('Calling Sign-Out endpoint with body: %o', req.body);
      try {
        return res.status(200).end();
      } catch (e) {
        logger.error('Error: %o', e);
        return next(e);
      }
    }
  );
};
