const express = require('express');
const router = express.Router();
const committeeController = require('../controllers/committeeController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', committeeController.getMembers);
router.post('/', verifyToken, isAdmin, upload.single('image'), committeeController.createMember);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), committeeController.updateMember);
router.delete('/:id', verifyToken, isAdmin, committeeController.deleteMember);

module.exports = router;
