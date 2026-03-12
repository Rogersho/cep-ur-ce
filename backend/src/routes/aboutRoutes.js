const express = require('express');
const router = express.Router();
const { getAboutSections, createAboutSection, updateAboutSection, deleteAboutSection } = require('../controllers/aboutController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../utils/upload');

router.get('/', getAboutSections);
router.post('/', protect, adminOnly, upload.single('image'), createAboutSection);
router.put('/:id', protect, adminOnly, upload.single('image'), updateAboutSection);
router.delete('/:id', protect, adminOnly, deleteAboutSection);

module.exports = router;
