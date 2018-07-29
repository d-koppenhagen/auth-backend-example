import * as express from 'express';
import * as morgan from 'morgan';
import { json, urlencoded } from 'body-parser';

import { logger, stream } from './utils/logger';
import { router } from './routes';
import { validateRequest } from './middlewares/validateRequest';

export class Server {
  public static readonly DEFAULT_PORT: number = 8080;
  public static readonly API_BASE_PATH: string = process.env.APIBASEPATH || '/api/v1';

  private _app: express.Application;
  private _port: string | number;

  constructor() {
    if (!process.env.SECRET) {
      logger.error('Server | no environment value for key \'SECRET\' specified');
      process.exit(1);
    }
    this._createApp();
    this._config();
    this._listen();
  }

  private _createApp(): void {
    this._app = express();

    // enable loging and logrotate
    this._app.use(morgan('combined', { stream: stream }));

    this._app.use(json());         // to support JSON-encoded bodies
    this._app.use(urlencoded({     // to support URL-encoded bodies
      extended: true
    }));
    this._app.all('/*', (req, res, next) => {
      // CORS headers
      res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      // Set custom headers for CORS
      res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
      if (req.method == 'OPTIONS') {
        res.status(200).end();
      } else {
        next();
      }
    });

    // Auth Middleware - This will check if the token is valid
    // Only the requests that start with /api/v1/* will be checked for the token.
    // Any URL's that do not follow the below pattern should be avoided unless you
    // are sure that authentication is not needed
    this._app.all(`${Server.API_BASE_PATH}/*`, [validateRequest]);

    // use api routes
    this._app.use('/', router);
  }

  private _config(): void {
    this._port = process.env.PORT || Server.DEFAULT_PORT;
  }

  private _listen(): void {
    this._app.listen(this._port, () => {
      logger.info('Server | Server is listening on port', this._port);
    });
  }

  public getApp(): express.Application {
    return this._app;
  }
}
