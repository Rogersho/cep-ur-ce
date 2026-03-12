const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({
            id: result.insertId,
            username,
            email,
            token: generateToken(result.insertId, 'member')
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = rows[0];
        if (user.status === 'suspended') {
            return res.status(403).json({ message: 'Your account has been suspended.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status,
            token: generateToken(user.id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/SystemAdmin
const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, username, email, role, status FROM users ORDER BY username ASC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// @desc    Update user role & status
// @route   PUT /api/auth/users/:id
// @access  Private/SystemAdmin
const updateUser = async (req, res) => {
    try {
        const { role, status } = req.body;
        await pool.execute('UPDATE users SET role = ?, status = ? WHERE id = ?', [role, status, req.params.id]);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/SystemAdmin
const deleteUser = async (req, res) => {
    try {
        await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// @desc    Change user password by admin
// @route   PUT /api/auth/users/:id/password
// @access  Private/SystemAdmin
const adminChangePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.params.id]);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error changing password', error: error.message });
    }
};

const getMyPermissions = async (req, res) => {
    try {
        const userId = req.user.id;
        
        if (['system_admin', 'cep_admin'].includes(req.user.role)) {
            return res.json({ albums: [], choirs: [], isAdmin: true });
        }

        const [albums] = await pool.execute(
            'SELECT a.id, a.title FROM album_permissions ap JOIN albums a ON ap.album_id = a.id WHERE ap.user_id = ?',
            [userId]
        );

        const [choirs] = await pool.execute(
            'SELECT c.id, c.name FROM choir_permissions cp JOIN choirs c ON cp.choir_id = c.id WHERE cp.user_id = ?',
            [userId]
        );

        res.json({ albums, choirs, isAdmin: false });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching my permissions', error: error.message });
    }
};

module.exports = { registerUser, loginUser, getAllUsers, updateUser, deleteUser, adminChangePassword, getMyPermissions };
