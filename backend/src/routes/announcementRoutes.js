const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement, deleteAnnouncement, updateAnnouncement } = require('../controllers/announcementController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAnnouncements);
router.post('/', protect, adminOnly, createAnnouncement);
router.put('/:id', protect, adminOnly, updateAnnouncement);
router.delete('/:id', protect, adminOnly, deleteAnnouncement);

module.exports = router;
