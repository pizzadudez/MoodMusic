const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/', authController.authorize);
router.get('/callback', authController.authorizeCallback);
router.get('/refresh_token', authController.refreshToken);

module.exports = router;