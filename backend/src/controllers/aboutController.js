const pool = require('../config/db');

// @desc    Get all about sections
// @route   GET /api/about
// @access  Public
const getAboutSections = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM about_sections ORDER BY order_index ASC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching about sections', error: error.message });
    }
};

// @desc    Create an about section
// @route   POST /api/about
// @access  Private/Admin
const createAboutSection = async (req, res) => {
    try {
        const { title_en, title_rw, title_fr, content_en, content_rw, content_fr, order_index } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        const [result] = await pool.query(
            'INSERT INTO about_sections (title_en, title_rw, title_fr, content_en, content_rw, content_fr, image_url, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title_en, title_rw, title_fr, content_en, content_rw, content_fr, imageUrl, order_index || 0]
        );

        res.status(201).json({ 
            id: result.insertId, 
            title_en, title_rw, title_fr, 
            content_en, content_rw, content_fr, 
            image_url: imageUrl, 
            order_index 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating about section', error: error.message });
    }
};

// @desc    Update an about section
// @route   PUT /api/about/:id
// @access  Private/Admin
const updateAboutSection = async (req, res) => {
    try {
        const { title_en, title_rw, title_fr, content_en, content_rw, content_fr, order_index } = req.body;
        const sectionId = req.params.id;

        const [rows] = await pool.query('SELECT * FROM about_sections WHERE id = ?', [sectionId]);
        if (rows.length === 0) return res.status(404).json({ message: 'Section not found' });

        const imageUrl = req.file ? req.file.path : rows[0].image_url;

        await pool.query(
            'UPDATE about_sections SET title_en = ?, title_rw = ?, title_fr = ?, content_en = ?, content_rw = ?, content_fr = ?, image_url = ?, order_index = ? WHERE id = ?',
            [title_en, title_rw, title_fr, content_en, content_rw, content_fr, imageUrl, order_index || 0, sectionId]
        );

        res.status(200).json({ 
            id: sectionId, 
            title_en, title_rw, title_fr, 
            content_en, content_rw, content_fr, 
            image_url: imageUrl, 
            order_index 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating about section', error: error.message });
    }
};

// @desc    Delete an about section
// @route   DELETE /api/about/:id
// @access  Private/Admin
const deleteAboutSection = async (req, res) => {
    try {
        await pool.query('DELETE FROM about_sections WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: 'Section deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting about section', error: error.message });
    }
};

module.exports = {
    getAboutSections,
    createAboutSection,
    updateAboutSection,
    deleteAboutSection
};
