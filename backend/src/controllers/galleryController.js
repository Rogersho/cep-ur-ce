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
    const { title, choir_id } = req.body;
    let image_path = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const [result] = await pool.execute(
            'INSERT INTO galleries (title, image_path, choir_id) VALUES (?, ?, ?)',
            [title, image_path, choir_id || null]
        );
        res.status(201).json({ id: result.insertId, title, image_path, choir_id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteGalleryItem = async (req, res) => {
    try {
        await pool.execute('DELETE FROM galleries WHERE id = ?', [req.params.id]);
        res.json({ message: 'Photo removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateGalleryItem = async (req, res) => {
    const { title, choir_id } = req.body;
    let updateQuery = 'UPDATE galleries SET title=?, choir_id=?';
    let updateParams = [title, choir_id || null];

    if (req.file) {
        updateQuery += ', image_path=?';
        updateParams.push(`/uploads/${req.file.filename}`);
    }

    updateQuery += ' WHERE id=?';
    updateParams.push(req.params.id);

    try {
        await pool.execute(updateQuery, updateParams);
        res.json({ message: 'Gallery item updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getGalleryItems, addGalleryItem, deleteGalleryItem, updateGalleryItem };
