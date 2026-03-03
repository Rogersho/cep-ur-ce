const pool = require('../config/db');

const getChoirs = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM choirs');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createChoir = async (req, res) => {
    const { name, description } = req.body;
    let thumbnail_url = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const [result] = await pool.execute(
            'INSERT INTO choirs (name, description, thumbnail_url) VALUES (?, ?, ?)',
            [name, description, thumbnail_url]
        );
        res.status(201).json({ id: result.insertId, name, description, thumbnail_url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteChoir = async (req, res) => {
    try {
        await pool.execute('DELETE FROM choirs WHERE id = ?', [req.params.id]);
        res.json({ message: 'Choir removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getChoirs, createChoir, deleteChoir };
