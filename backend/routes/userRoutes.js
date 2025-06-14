const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// NOTE: For real use, add authentication middleware as needed

router.post('/register', userController.register);
router.post('/login', userController.login);
// For demo, assume req.user is set by middleware
router.get('/profile', userController.getProfile);

module.exports = router;