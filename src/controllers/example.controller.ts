import { Request, Response, NextFunction } from 'express';

import { logger } from '../utils/logger';

export class ExampleController {

  constructor() {}

  getData(req: Request, res: Response, next: NextFunction) {
    logger.info('exampleController | received GET');
    res.json({
      key1: this._generateExampleData(),
      key2: this._generateExampleData(),
      key3: [this._generateExampleData(), this._generateExampleData()],
      key4: {
        a: this._generateExampleData(),
        b: this._generateExampleData()
      },
    });
  }

  private _generateExampleData() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
}
