import * as winston from 'winston';
require('winston-syslog').Syslog;
import * as util from 'util';

const defaultOptions = {
  level: 'debug',
  handleExceptions: true,
  humanReadableUnhandledException: true,
  json: false,
  colorize: true
}

export const logger = new winston.Logger({
  transports: [
    new winston.transports.Syslog(defaultOptions),
    new winston.transports.Console(defaultOptions)
  ],
  levels: winston.config.syslog.levels,
  exitOnError: false
});

export const stream = {
  write: (message: any) => {
    message = `HTTP | ${message}`;
    console.log(message);
    // check for HTTP Response code to colorize output on console
    if (message.match(/HTTP\/\d\.\d\" 4\d{2}/g)) {
      logger.notice(message)
    }
    else if (message.match(/HTTP\/\d\.\d\" 5\d{2}/g)) {
      logger.error(message)
    }
    else {
      logger.info(message)
    }
  }
};

export let formatJSON = (obj: {}) => {
  return util.inspect(obj, { depth: null, colors: true });
}
