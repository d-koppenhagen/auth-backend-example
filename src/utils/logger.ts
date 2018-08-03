import { createLogger, transports, config } from 'winston';
import { inspect } from 'util';
const winston = require('winston');
require('winston-syslog').Syslog;

const defaultOptions = {
  level: 'debug',
  handleExceptions: true,
  humanReadableUnhandledException: true,
  json: false,
  colorize: true
}

export const logger = createLogger({
  transports: [
    new winston.transports.Syslog(defaultOptions),
    new transports.Console(defaultOptions)
  ],
  levels: config.syslog.levels,
  exitOnError: false
});

export const stream = {
  write: (message: any) => {
    message = `HTTP | ${message}`;
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
  return inspect(obj, { depth: null, colors: true });
}
