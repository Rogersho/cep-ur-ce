const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateSchema() {
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
        console.log('1. Modifying role column to include new roles...');
        // First, allow the new roles in the ENUM
        await conn.execute("ALTER TABLE users MODIFY COLUMN role ENUM('system_admin', 'cep_admin', 'choir_header', 'member', 'admin') DEFAULT 'member'");
        
        console.log('2. Migrating existing "admin" users to "system_admin"...');
        await conn.execute("UPDATE users SET role = 'system_admin' WHERE role = 'admin'");
        
        console.log('3. Finalizing role column ENUM (removing old "admin" value)...');
        await conn.execute("ALTER TABLE users MODIFY COLUMN role ENUM('system_admin', 'cep_admin', 'choir_header', 'member') DEFAULT 'member'");

        console.log('4. Adding status column...');
        // Check if status exists first to avoid error
        const [cols] = await conn.execute("DESCRIBE users");
        if (!cols.some(c => c.Field === 'status')) {
            await conn.execute("ALTER TABLE users ADD COLUMN status ENUM('active', 'suspended') DEFAULT 'active' AFTER role");
            console.log('Status column added.');
        } else {
            console.log('Status column already exists.');
        }

        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('MIGRATION ERROR:', err.message);
    } finally {
        await conn.end();
    }
}
migrateSchema();
