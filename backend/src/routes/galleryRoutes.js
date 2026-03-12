const express = require('express');
const router = express.Router();
const { getGalleryItems, addGalleryItem, deleteGalleryItem, updateGalleryItem } = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getGalleryItems);
router.post('/', protect, upload.single('image'), addGalleryItem);
router.put('/:id', protect, upload.single('image'), updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;
