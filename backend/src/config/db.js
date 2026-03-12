const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: (process.env.DB_HOST || '').trim(),
    user: (process.env.DB_USER || '').trim(),
    password: (process.env.DB_PASS || '').trim(),
    database: (process.env.DB_NAME || '').trim(),
    port: parseInt(process.env.DB_PORT) || 3306,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
