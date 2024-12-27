import express, { Application } from 'express';
import cors from 'cors';
import { OpticMiddleware } from '@useoptic/express-middleware';
import routes from '../api';
import config from '../config';

interface ExpressLoaderOptions {
  app: Application;
}

const expressLoader = ({ app }: ExpressLoaderOptions) => {
  /**
   * Health Check endpoints
   */
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.enable('trust proxy');

  // Enable Cross Origin Resource Sharing
  app.use(cors());

  // Middleware that transforms the raw string of req.body into json
  app.use(express.json());

  // Load API routes
  app.use(config.api.prefix, routes());

  // API Documentation
  if (process.env.NODE_ENV === 'development') {
    app.use(
      OpticMiddleware({
        enabled: true,
      })
    );
  }

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  /// error handlers
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
    }
    return next(err);
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};

export default expressLoader;
