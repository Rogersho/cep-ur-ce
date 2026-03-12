const express = require('express');
const router = express.Router();
const committeeController = require('../controllers/committeeController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../utils/upload');

router.get('/', committeeController.getMembers);
router.post('/', protect, adminOnly, upload.single('image'), committeeController.createMember);
router.put('/:id', protect, adminOnly, upload.single('image'), committeeController.updateMember);
router.delete('/:id', protect, adminOnly, committeeController.deleteMember);

module.exports = router;
