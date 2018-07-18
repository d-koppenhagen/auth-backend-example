import { Request, Response, NextFunction } from 'express';
import { decode } from 'jwt-simple';

import { logger } from '../utils/logger';
import { AuthController } from '../controllers/auth.controller';

const auth = new AuthController();

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe.

  // skip the token auth for [OPTIONS] requests.
  if (req.method == 'OPTIONS') next();

  // get token from request:
  const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  // get email from request:
  const key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

  if (token && key) {
    try {
      const decoded = decode(token, process.env.SECRET);

      if (decoded.exp <= Date.now()) {
        res.status(400);
        res.json({
          'status': 400,
          'message': 'Token Expired'
        });
        return;
      }

      // Authorize the user to see if s/he can access our resources
      // TODO: implement user permission roles (admin, user, etc.)
      auth.validateUser(key, (user) => {
        logger.info('validateRequest | key: ' + key);
        logger.info('validateRequest | user: ' + user);
        if (user) {
          if ((req.url.indexOf('admin') >= 0 && user.role == 'admin') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/v1/') >= 0)) {
            next(); // To move to next middleware
          } else {
            res.status(403);
            res.json({
              'status': 403,
              'message': 'Not Authorized'
            });
            return;
          }
        } else {
          // No user with this name exists, respond back with a 401
          res.status(401);
          res.json({
            'status': 401,
            'message': 'Invalid User'
          });
        }
      }); // The key would be the logged in user's email
    } catch (err) {
      res.status(500);
      res.json({
        'status': 500,
        'message': 'Oops something went wrong',
        'error': err
      });
    }
  } else {
    res.status(401);
    res.json({
      'status': 401,
      'message': 'Invalid Token or Key'
    });
    return;
  }
};
