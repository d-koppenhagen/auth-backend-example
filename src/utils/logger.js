const winston = require('winston');
const path = require('path');
const fs = require('fs');
const touch = require('touch');
const util = require('util');
winston.emitErrs = true;

const logDir = path.join(__dirname, '..', '..', 'log');
const accessLogName = 'combined.log';

// create log directory and files if not exist
fs.existsSync(logDir) || fs.mkdirSync(logDir);
touch.sync(path.join(logDir, accessLogName));

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: path.join(__dirname, '..', '..', 'log', accessLogName),
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: false,
      maxsize: 5242880, //max. 5MB for the log file
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write: (message, encoding) => {
    message = `HTTP | ${message}`;
    // check for HTTP Response code to colorize output on console
    if (message.match(/HTTP\/\d\.\d\" 4\d{2}/g)) {
      logger.warn(message)
    }
    else if (message.match(/HTTP\/\d\.\d\" 5\d{2}/g)) {
      logger.error(message)
    }
    else {
      logger.info(message)
    }
  }
};

module.exports.JSON = function (obj) {
  return util.inspect(obj, { depth: null, colors: true });
}
