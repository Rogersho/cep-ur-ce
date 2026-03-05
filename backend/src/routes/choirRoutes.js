const express = require('express');
const router = express.Router();
const { getChoirs, createChoir, deleteChoir } = require('../controllers/choirController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../utils/upload');

router.get('/', getChoirs);
router.post('/', protect, adminOnly, upload.single('image'), createChoir);
router.put('/:id', protect, adminOnly, upload.single('image'), updateChoir);
router.delete('/:id', protect, adminOnly, deleteChoir);

module.exports = router;
