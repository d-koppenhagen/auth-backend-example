import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

import { logger, stream } from './utils/logger';
import { router } from './routes';
import { validateRequest } from './middlewares/validateRequest';

export class Server {
  public static readonly PORT:number = 8080;
  private app: express.Application;
  private port: string | number;

  constructor() {
    if (!process.env.SECRET) {
      logger.error('Server | no environment value for key \'SECRET\' specified');
      process.exit(1);
    }
    this.createApp();
    this.config();
    this.listen();
  }

  private createApp(): void {
    this.app = express();

    // enable loging and logrotate
    this.app.use(morgan('combined', { stream: stream }));

    this.app.use(bodyParser.json());         // to support JSON-encoded bodies
    this.app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    }));
    this.app.all('/*', (req, res, next) => {
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
    this.app.all('/api/v1/*', [validateRequest]);

    // use api routes
    this.app.use('/', router);
  }

  private config(): void {
    this.port = process.env.PORT || Server.PORT;
  }

  private listen(): void {
    this.app.listen(this.port, () => {
      logger.info('Server | Server is listening on port', this.port);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
