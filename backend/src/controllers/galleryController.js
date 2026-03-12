const pool = require('../config/db');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM galleries ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add gallery item
// @route   POST /api/gallery
// @access  Private (Admin or with Choir/Album Permission)
const addGalleryItem = async (req, res) => {
    const { title, choir_id, album_id } = req.body;
    const userId = req.user.id;
    let image_path = req.file ? req.file.path : null;

    try {
        // Permission Check
        if (req.user.role !== 'admin') {
            let hasPerm = false;
            
            if (choir_id) {
                const [cp] = await pool.query('SELECT id FROM choir_permissions WHERE choir_id = ? AND user_id = ?', [choir_id, userId]);
                if (cp.length > 0) hasPerm = true;
            }
            
            if (!hasPerm && album_id) {
                const [ap] = await pool.query('SELECT id FROM album_permissions WHERE album_id = ? AND user_id = ?', [album_id, userId]);
                if (ap.length > 0) hasPerm = true;
            }

            if (!hasPerm) {
                return res.status(403).json({ message: 'You do not have permission to upload here.' });
            }
        }

        const isVideo = req.file?.mimetype.startsWith('video/');
        const mediaType = isVideo ? 'video' : 'image';

        const [result] = await pool.execute(
            'INSERT INTO galleries (title, image_path, choir_id, album_id, media_type, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)',
            [title, image_path, choir_id || null, album_id || null, mediaType, userId]
        );
        res.status(201).json({ id: result.insertId, title, image_path, choir_id, album_id, media_type: mediaType });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteGalleryItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const userId = req.user.id;

        // Check if item exists and get its associations
        const [items] = await pool.query('SELECT uploaded_by, choir_id, album_id FROM galleries WHERE id = ?', [itemId]);
        if (items.length === 0) return res.status(404).json({ message: 'Item not found' });
        
        const item = items[0];

        // Permission Check
        if (req.user.role !== 'admin' && item.uploaded_by !== userId) {
            let hasPerm = false;
            if (item.choir_id) {
                const [cp] = await pool.query('SELECT id FROM choir_permissions WHERE choir_id = ? AND user_id = ?', [item.choir_id, userId]);
                if (cp.length > 0) hasPerm = true;
            }
            if (!hasPerm && item.album_id) {
                const [ap] = await pool.query('SELECT id FROM album_permissions WHERE album_id = ? AND user_id = ?', [item.album_id, userId]);
                if (ap.length > 0) hasPerm = true;
            }

            if (!hasPerm) return res.status(403).json({ message: 'Permission denied' });
        }

        await pool.execute('DELETE FROM galleries WHERE id = ?', [itemId]);
        res.json({ message: 'Photo removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateGalleryItem = async (req, res) => {
    const { title, choir_id, album_id } = req.body;
    const itemId = req.params.id;
    const userId = req.user.id;

    try {
        const [items] = await pool.query('SELECT uploaded_by, choir_id, album_id FROM galleries WHERE id = ?', [itemId]);
        if (items.length === 0) return res.status(404).json({ message: 'Item not found' });
        const item = items[0];

        if (req.user.role !== 'admin' && item.uploaded_by !== userId) {
            let hasPerm = false;
            if (item.choir_id) {
                const [cp] = await pool.query('SELECT id FROM choir_permissions WHERE choir_id = ? AND user_id = ?', [item.choir_id, userId]);
                if (cp.length > 0) hasPerm = true;
            }
            if (!hasPerm && item.album_id) {
                const [ap] = await pool.query('SELECT id FROM album_permissions WHERE album_id = ? AND user_id = ?', [item.album_id, userId]);
                if (ap.length > 0) hasPerm = true;
            }
            if (!hasPerm) return res.status(403).json({ message: 'Permission denied' });
        }

        let updateQuery = 'UPDATE galleries SET title=?, choir_id=?, album_id=?';
        let updateParams = [title, choir_id || null, album_id || null];

        if (req.file) {
            updateQuery += ', image_path=?, media_type=?';
            const isVideo = req.file.mimetype.startsWith('video/');
            updateParams.push(req.file.path, isVideo ? 'video' : 'image');
        }

        updateQuery += ' WHERE id=?';
        updateParams.push(itemId);

        await pool.execute(updateQuery, updateParams);
        res.json({ message: 'Gallery item updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getGalleryItems, addGalleryItem, deleteGalleryItem, updateGalleryItem };
