const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, getMyPermissions } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/me/permissions', protect, getMyPermissions);

module.exports = router;
