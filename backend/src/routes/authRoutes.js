const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, getMyPermissions, updateUser, deleteUser, adminChangePassword } = require('../controllers/authController');
const { protect, adminOnly, systemAdminOnly } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', protect, systemAdminOnly, getAllUsers);
router.put('/users/:id', protect, systemAdminOnly, updateUser);
router.delete('/users/:id', protect, systemAdminOnly, deleteUser);
router.put('/users/:id/password', protect, systemAdminOnly, adminChangePassword);
router.get('/me/permissions', protect, getMyPermissions);

module.exports = router;
