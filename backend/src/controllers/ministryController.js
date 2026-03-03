const pool = require('../config/db');

// @desc    Get all ministries
// @route   GET /api/ministries
// @access  Public
const getMinistries = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM ministries');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create ministry
// @route   POST /api/ministries
// @access  Private/Admin
const createMinistry = async (req, res) => {
    const { name, leader_name, description, contact_info } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO ministries (name, leader_name, description, contact_info) VALUES (?, ?, ?, ?)',
            [name, leader_name, description, contact_info]
        );
        res.status(201).json({ id: result.insertId, name, leader_name, description, contact_info });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMinistries, createMinistry };
