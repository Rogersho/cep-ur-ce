const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const choirRoutes = require('./routes/choirRoutes');
const ministryRoutes = require('./routes/ministryRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/choirs', choirRoutes);
app.use('/api/ministries', ministryRoutes);
app.use('/api/gallery', galleryRoutes);

// Health check
app.get('/', (req, res) => res.send('CEP UR-CE API is running...'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
