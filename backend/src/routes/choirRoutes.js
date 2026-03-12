const express = require('express');
const router = express.Router();
const { getChoirs, createChoir, deleteChoir, updateChoir } = require('../controllers/choirController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../utils/upload');

router.get('/', getChoirs);
router.post('/', protect, adminOnly, upload.single('image'), createChoir);
router.put('/:id', protect, adminOnly, upload.single('image'), updateChoir);
router.delete('/:id', protect, adminOnly, deleteChoir);

// Permission Management
router.get('/:id/permissions', protect, adminOnly, require('../controllers/choirController').getChoirPermissions);
router.post('/:id/permissions', protect, adminOnly, require('../controllers/choirController').grantChoirPermission);
router.delete('/:id/permissions/:userId', protect, adminOnly, require('../controllers/choirController').revokeChoirPermission);

module.exports = router;
