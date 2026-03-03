const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../utils/upload');

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, adminOnly, upload.single('images'), createEvent);
router.put('/:id', protect, adminOnly, upload.single('images'), updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;
