const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkSchema() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'cep_db'
    });

    try {
        const tables = ['choirs', 'galleries', 'events', 'announcements'];
        for (const table of tables) {
            const [cols] = await conn.execute(`DESCRIBE ${table}`);
            console.log(`--- ${table.toUpperCase()} ---`);
            cols.forEach(c => console.log(`${c.Field} (${c.Type})`));
        }
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await conn.end();
    }
}
checkSchema();
