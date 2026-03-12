const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');

async function checkUserSchema() {
    const conn = await mysql.createConnection({
        host: (process.env.DB_HOST || '').trim(),
        user: (process.env.DB_USER || '').trim(),
        password: (process.env.DB_PASS || '').trim(),
        database: (process.env.DB_NAME || '').trim(),
        port: parseInt(process.env.DB_PORT) || 3306,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        const [cols] = await conn.execute(`DESCRIBE users`);
        const schema = cols.map(c => ({
            field: c.Field,
            type: c.Type,
            default: c.Default
        }));
        fs.writeFileSync('schema_output.json', JSON.stringify(schema, null, 2));
        console.log('Schema written to schema_output.json');
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await conn.end();
    }
}
checkUserSchema();
