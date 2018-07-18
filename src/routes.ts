import { Router } from 'express';

export const router = Router({ mergeParams: true });

import { AuthController } from './controllers/auth.controller';
import { ExampleController } from './controllers/example.controller';

const auth = new AuthController();
const example = new ExampleController();
/*
 * Routes that can be accessed by any one (no auth neccessary)
 */
router.post('/login', (req, res, next) => auth.login(req, res, next));
router.post('/signup', (req, res, next) => auth.signup(req, res, next));

/*
 * Routes that can be accessed only by authenticated users (auth headers must be set)
 */
router.get('/api/v1/example', (req, res, next) => example.getData(req, res, next));
