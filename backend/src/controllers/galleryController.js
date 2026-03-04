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
// @access  Private/Admin
const addGalleryItem = async (req, res) => {
    const { choir_id, title, media_type } = req.body;
    let image_path = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image_path) return res.status(400).json({ message: 'Please upload an image' });

    try {
        const [result] = await pool.execute(
            'INSERT INTO galleries (choir_id, title, image_path, media_type) VALUES (?, ?, ?, ?)',
            [choir_id || null, title, image_path, media_type || 'image']
        );
        res.status(201).json({ id: result.insertId, choir_id, title, image_path, media_type });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getGalleryItems, addGalleryItem };
