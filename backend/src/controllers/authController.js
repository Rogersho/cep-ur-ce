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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, username, email, role FROM users ORDER BY username ASC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

const getMyPermissions = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // If admin, they have permission to everything, but we can't easily list "everything" efficiently here
        // Usually we just return empty lists and the frontend handles "is admin" logic
        if (req.user.role === 'admin') {
            return res.json({ albums: [], choirs: [], isAdmin: true });
        }

        const [albums] = await pool.query(
            'SELECT a.id, a.title FROM album_permissions ap JOIN albums a ON ap.album_id = a.id WHERE ap.user_id = ?',
            [userId]
        );

        const [choirs] = await pool.query(
            'SELECT c.id, c.name FROM choir_permissions cp JOIN choirs c ON cp.choir_id = c.id WHERE cp.user_id = ?',
            [userId]
        );

        res.json({ albums, choirs, isAdmin: false });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching my permissions', error: error.message });
    }
};

module.exports = { registerUser, loginUser, getAllUsers, getMyPermissions };
