const express = require('express');
const router = express.Router({ mergeParams: true });
const logger = require('./utils/logger');

const auth = require('./controllers/auth.controller.js');
const example = require('./controllers/example.controller.js');

/*
 * Routes that can be accessed by any one (no auth neccessary)
 */
router.post('/login', auth.login);
router.post('/signup', auth.signUp);

/*
 * Routes that can be accessed only by authenticated users (auth headers must be set)
 */
router.get('/api/v1/example', example.getData);

module.exports = router;
