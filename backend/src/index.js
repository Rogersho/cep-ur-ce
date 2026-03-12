const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const choirRoutes = require('./routes/choirRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const albumRoutes = require('./routes/albumRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const committeeRoutes = require('./routes/committeeRoutes');
const dbInit = require('./utils/dbInit');
const fs = require('fs-extra');

const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/choirs', choirRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/committee', committeeRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

dbInit().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error('Failed to start server due to DB init error:', err);
});
