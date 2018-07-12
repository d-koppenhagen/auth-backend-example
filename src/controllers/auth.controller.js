const jwt = require('jwt-simple');

const logger = require('../utils/logger');
const config = require('../../config');

exports.login = (req, res) => {
    logger.info('authController | ' + logger.JSON(req.body));

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
    res.json(genToken(req.body));
}

exports.signUp = (req, res, next) => {
  logger.info('userController | ' + logger.JSON(req.body));
  res.status(201).json(genToken(req.body));
}

exports.validateUser = (email, cb) => {
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
function genToken(user) {
  var expires = expiresIn(7); // 7 days
  var token = jwt.encode({
    exp: expires
  }, config.secret);

  return {
    token: token,
    expires: expires,
    user: user
  };
}

// calculate expiration time based in current date + validity period (in days)
function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}


