import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jwt-simple';

import { logger, formatJSON } from '../utils/logger';
import { User } from '../models/user';

export class AuthController {

  constructor() {}

  public login(req: Request, res: Response, next: NextFunction) {
    logger.info('authController | ' + formatJSON(req.body));

    const email = req.body.email || null;
    const password = req.body.password || null;

    if (!email || !password) {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    /*
    * TODO: userData should by veridied against a database password value
    * The received password value is md5 hashed and passwords in database should be stored in that way
    * If the check fails: send 401: unauthorized back to the client
    */

    // send 200 OK, should be adjusted (see comment box before)
    res.json(this._genToken(req.body));
  }

  public signup(req: Request, res: Response, next: NextFunction) {
    logger.info('userController | ' + formatJSON(req.body));
    res.status(201).json(this._genToken(req.body));
  }

  public validateUser(email: string, cb: Function) {
    /*
    * TODO: check user againt your database
    * return callback (cb) with null if user is not valid
    * return callback (cb) with true or the response from the check if user is valid
    */

    /* example check against a mysql db
    const query = `SELECT * FROM user WHERE email = '${email}'`;
    db.query(query, (error, results, fields) => {
      if (error) { logger.error(error); }
      if (!results || results.length === 0) {
        logger.logDbResult(results, query);
        return cb(null);
      }
      return cb(results[0]);
    });
    */
    return cb(true);
  }

  // generate a token based on the user information and the secret provided in the config file
  private _genToken(user: User) {
    var expires = this._expiresIn(7); // 7 days
    var token = jwt.encode({
      exp: expires
    }, process.env.SECRET);

    return {
      token: token,
      expires: expires,
      user: user
    };
  }

  // calculate expiration time based in current date + validity period (in days)
  private _expiresIn(numDays: number) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
  }
}

