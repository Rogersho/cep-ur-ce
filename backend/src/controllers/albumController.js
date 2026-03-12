const pool = require('../config/db');

// @desc    Get all albums
// @route   GET /api/albums
// @access  Public
const getAlbums = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT a.*, COUNT(g.id) as item_count, u.username as creator_name FROM albums a LEFT JOIN galleries g ON a.id = g.album_id LEFT JOIN users u ON a.created_by = u.id GROUP BY a.id ORDER BY a.created_at DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching albums', error: error.message });
    }
};

// @desc    Create an album
// @route   POST /api/albums
// @access  Private/Admin
const createAlbum = async (req, res) => {
    try {
        const { title, description } = req.body;
        const imageUrl = req.file ? req.file.path : null;
        const [result] = await pool.query(
            'INSERT INTO albums (title, description, cover_image, created_by) VALUES (?, ?, ?, ?)',
            [title, description, imageUrl, req.user.id]
        );
        res.status(201).json({ id: result.insertId, title, description, cover_image: imageUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error creating album', error: error.message });
    }
};

// @desc    Update album
// @route   PUT /api/albums/:id
// @access  Private/Admin
const updateAlbum = async (req, res) => {
    try {
        const { title, description } = req.body;
        const albumId = req.params.id;

        const [albumRows] = await pool.query('SELECT * FROM albums WHERE id = ?', [albumId]);
        if (albumRows.length === 0) return res.status(404).json({ message: 'Album not found' });

        const cover_image = req.file ? req.file.path : albumRows[0].cover_image;

        await pool.query(
            'UPDATE albums SET title = ?, description = ?, cover_image = ? WHERE id = ?',
            [title, description, cover_image, albumId]
        );
        res.status(200).json({ id: albumId, title, description, cover_image });
    } catch (error) {
        res.status(500).json({ message: 'Error updating album', error: error.message });
    }
};

// @desc    Delete album
// @route   DELETE /api/albums/:id
// @access  Private/Admin
const deleteAlbum = async (req, res) => {
    try {
        // First delete associated gallery items OR just set album_id to null depending on preference
        // Based on the ON DELETE SET NULL on galleries fk_gallery_album, MySQL will handle setting to NULL
        await pool.query('DELETE FROM albums WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: 'Album deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting album', error: error.message });
    }
};

const getAlbumPermissions = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT ap.id, ap.user_id, u.username, u.email FROM album_permissions ap JOIN users u ON ap.user_id = u.id WHERE ap.album_id = ?',
            [req.params.id]
        );
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching permissions', error: error.message });
    }
};

// @desc    Grant user permission to upload to album
// @route   POST /api/albums/:id/permissions
// @access  Private/Admin
const grantAlbumPermission = async (req, res) => {
    try {
        const { userId } = req.body;
        const albumId = req.params.id;

        // Ensure user exists
        const [userRows] = await pool.execute('SELECT id FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) return res.status(404).json({ message: 'User not found' });

        await pool.execute(
            'INSERT IGNORE INTO album_permissions (album_id, user_id, granted_by) VALUES (?, ?, ?)',
            [albumId, userId, req.user.id]
        );
        res.status(201).json({ message: 'Permission granted' });
    } catch (error) {
        res.status(500).json({ message: 'Error granting permission', error: error.message });
    }
};

// @desc    Revoke permission
// @route   DELETE /api/albums/:id/permissions/:userId
// @access  Private/Admin
const revokeAlbumPermission = async (req, res) => {
    try {
        await pool.execute(
            'DELETE FROM album_permissions WHERE album_id = ? AND user_id = ?',
            [req.params.id, req.params.userId]
        );
        res.status(200).json({ message: 'Permission revoked' });
    } catch (error) {
        res.status(500).json({ message: 'Error revoking permission', error: error.message });
    }
};

// @desc    Upload an item to a specific album
// @route   POST /api/albums/:id/upload
// @access  Private (Needs permission or admin)
const uploadToAlbum = async (req, res) => {
    try {
        const albumId = req.params.id;
        const userId = req.user.id;

        // 1. Check if album exists
        const [albumRows] = await pool.query('SELECT id FROM albums WHERE id = ?', [albumId]);
        if (albumRows.length === 0) return res.status(404).json({ message: 'Album not found' });

        // 2. Check Permissions. User is either admin, or exists in album_permissions table
        if (!['system_admin', 'cep_admin'].includes(req.user.role)) {
            const [permRows] = await pool.query('SELECT id FROM album_permissions WHERE album_id = ? AND user_id = ?', [albumId, userId]);
            if (permRows.length === 0) {
                return res.status(403).json({ message: 'You do not have permission to upload to this album.' });
            }
        }

        // 3. Ensure file exists
        if (!req.file) return res.status(400).json({ message: 'Please upload a file' });

        const imagePath = req.file.path;
        const title = req.body.title || 'Untitled';

        const isVideo = req.file?.mimetype?.startsWith('video/');
        const mediaType = isVideo ? 'video' : 'image';

        // 4. Save to galleries table
        const [result] = await pool.execute(
            'INSERT INTO galleries (album_id, choir_id, title, image_path, media_type, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)',
            [albumId, req.body.choir_id || null, title, imagePath, mediaType, userId]
        );

        res.status(201).json({
            id: result.insertId,
            album_id: albumId,
            choir_id: req.body.choir_id || null,
            title,
            image_path: imagePath,
            media_type: mediaType,
            uploaded_by: userId
        });

    } catch (error) {
        console.error('Gallery upload error:', error);
        res.status(500).json({ message: 'Error uploading to album', error: error.message });
    }
};

module.exports = {
    getAlbums,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getAlbumPermissions,
    grantAlbumPermission,
    revokeAlbumPermission,
    uploadToAlbum
};
