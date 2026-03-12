const pool = require('../config/db');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM events ORDER BY event_date DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM events WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Event not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
    const { title, description, date, location, category } = req.body;
    let image_url = req.file ? req.file.path : null;

    try {
        const [result] = await pool.execute(
            'INSERT INTO events (title, description, event_date, location, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, date, location, category || null, image_url]
        );
        res.status(201).json({ id: result.insertId, title, description, event_date: date, location, category, image_url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
    const { title, description, date, location, category } = req.body;
    let updateQuery = 'UPDATE events SET title=?, description=?, event_date=?, location=?, category=?';
    let updateParams = [title, description, date, location, category || null];

    if (req.file) {
        updateQuery += ', image_url=?';
        updateParams.push(req.file.path);
    }

    updateQuery += ' WHERE id=?';
    updateParams.push(req.params.id);

    try {
        const [result] = await pool.execute(updateQuery, updateParams);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM events WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
