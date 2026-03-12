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
    const { name, description, leader_name } = req.body;
    let thumbnail_url = req.file ? req.file.path : null;
    try {
        const [result] = await pool.execute(
            'INSERT INTO choirs (name, description, leader_name, thumbnail_url) VALUES (?, ?, ?, ?)',
            [name, description, leader_name, thumbnail_url]
        );
        res.status(201).json({ id: result.insertId, name, description, leader_name, thumbnail_url });
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

const updateChoir = async (req, res) => {
    const { name, description, leader_name } = req.body;
    let updateQuery = 'UPDATE choirs SET name=?, description=?, leader_name=?';
    let updateParams = [name, description, leader_name];

    if (req.file) {
        updateQuery += ', thumbnail_url=?';
        updateParams.push(req.file.path);
    }

    updateQuery += ' WHERE id=?';
    updateParams.push(req.params.id);

    try {
        await pool.execute(updateQuery, updateParams);
        res.json({ message: 'Choir updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getChoirPermissions = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT cp.id, cp.user_id, u.username, u.email FROM choir_permissions cp JOIN users u ON cp.user_id = u.id WHERE cp.choir_id = ?',
            [req.params.id]
        );
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching permissions', error: error.message });
    }
};

const grantChoirPermission = async (req, res) => {
    try {
        const { userId } = req.body;
        const choirId = req.params.id;

        const [userRows] = await pool.query('SELECT id FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) return res.status(404).json({ message: 'User not found' });

        await pool.query(
            'INSERT IGNORE INTO choir_permissions (choir_id, user_id, granted_by) VALUES (?, ?, ?)',
            [choirId, userId, req.user.id]
        );
        res.status(201).json({ message: 'Permission granted' });
    } catch (error) {
        res.status(500).json({ message: 'Error granting permission', error: error.message });
    }
};

const revokeChoirPermission = async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM choir_permissions WHERE choir_id = ? AND user_id = ?',
            [req.params.id, req.params.userId]
        );
        res.status(200).json({ message: 'Permission revoked' });
    } catch (error) {
        res.status(500).json({ message: 'Error revoking permission', error: error.message });
    }
};

module.exports = { 
    getChoirs, 
    createChoir, 
    deleteChoir, 
    updateChoir,
    getChoirPermissions,
    grantChoirPermission,
    revokeChoirPermission
};
