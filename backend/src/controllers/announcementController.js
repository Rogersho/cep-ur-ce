const pool = require('../config/db');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
const getAnnouncements = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM announcements ORDER BY published_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = async (req, res) => {
    const { title, content, importance } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO announcements (title, content, importance) VALUES (?, ?, ?)',
            [title, content, importance || 'normal']
        );
        res.status(201).json({ id: result.insertId, title, content, importance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = async (req, res) => {
    try {
        await pool.execute('DELETE FROM announcements WHERE id = ?', [req.params.id]);
        res.json({ message: 'Announcement removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAnnouncement = async (req, res) => {
    const { title, content, importance } = req.body;
    try {
        await pool.execute(
            'UPDATE announcements SET title=?, content=?, importance=? WHERE id=?',
            [title, content, importance || 'normal', req.params.id]
        );
        res.json({ message: 'Announcement updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAnnouncements, createAnnouncement, deleteAnnouncement, updateAnnouncement };
