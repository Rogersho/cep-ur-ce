const express = require('express');
const router = express.Router();
const { getGalleryItems, addGalleryItem, deleteGalleryItem, updateGalleryItem } = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../utils/upload');

router.get('/', getGalleryItems);
router.post('/', protect, adminOnly, upload.single('image'), addGalleryItem);
router.put('/:id', protect, adminOnly, upload.single('image'), updateGalleryItem);
router.delete('/:id', protect, adminOnly, deleteGalleryItem);

module.exports = router;
