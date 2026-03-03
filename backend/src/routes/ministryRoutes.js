const express = require('express');
const router = express.Router();
const { getMinistries, createMinistry } = require('../controllers/ministryController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getMinistries);
router.post('/', protect, adminOnly, createMinistry);

module.exports = router;
