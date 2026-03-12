const pool = require('../config/db');

const committeeController = {
    // Get all committee members grouped by year range
    getMembers: async (req, res) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM committee_members ORDER BY year_range DESC, order_index ASC');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create a new committee member
    createMember: async (req, res) => {
        try {
            const { name, email, phone, position, bio, year_range, order_index } = req.body;
            const image_url = req.file ? req.file.path : null;

            const [result] = await pool.execute(
                'INSERT INTO committee_members (name, email, phone, position, bio, year_range, image_url, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, email || null, phone || null, position, bio || null, year_range, image_url, order_index || 0]
            );

            res.status(201).json({ id: result.insertId, message: 'Member added' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update a committee member
    updateMember: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, phone, position, bio, year_range, order_index } = req.body;
            let query = 'UPDATE committee_members SET name=?, email=?, phone=?, position=?, bio=?, year_range=?, order_index=?';
            let params = [name, email || null, phone || null, position, bio || null, year_range, order_index || 0];

            if (req.file) {
                query += ', image_url=?';
                params.push(req.file.path);
            }

            query += ' WHERE id=?';
            params.push(id);

            await pool.execute(query, params);
            res.json({ message: 'Member updated' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete a committee member
    deleteMember: async (req, res) => {
        try {
            const { id } = req.params;
            await pool.execute('DELETE FROM committee_members WHERE id = ?', [id]);
            res.json({ message: 'Member deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = committeeController;
