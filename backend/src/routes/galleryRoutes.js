const express = require('express');
const router = express.Router();
const { getGalleryItems, addGalleryItem } = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../utils/upload');

router.get('/', getGalleryItems);
router.post('/', protect, adminOnly, upload.single('images'), addGalleryItem);

module.exports = router;
