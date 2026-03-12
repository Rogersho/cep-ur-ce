const express = require('express');
const router = express.Router();
const {
    getAlbums,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getAlbumPermissions,
    grantAlbumPermission,
    revokeAlbumPermission,
    uploadToAlbum
} = require('../controllers/albumController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getAlbums);

// Admin / Upload routes
router.post('/', protect, adminOnly, upload.single('image'), createAlbum);
router.put('/:id', protect, adminOnly, upload.single('image'), updateAlbum);
router.delete('/:id', protect, adminOnly, deleteAlbum);

// Permissions management
router.get('/:id/permissions', protect, adminOnly, getAlbumPermissions);
router.post('/:id/permissions', protect, adminOnly, grantAlbumPermission);
router.delete('/:id/permissions/:userId', protect, adminOnly, revokeAlbumPermission);

// Upload to specific album (Must be admin or have permission)
router.post('/:id/upload', protect, upload.single('image'), uploadToAlbum);

module.exports = router;
