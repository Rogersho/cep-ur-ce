const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const migrateRoles = async () => {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT) || 3306,
            ssl: { rejectUnauthorized: false }
        });

        console.log('Migrating user roles enum...');
        
        // 1. Alter the table to update the ENUM
        await connection.query(`
            ALTER TABLE users 
            MODIFY COLUMN role ENUM('system_admin', 'cep_admin', 'choir_header', 'member', 'admin') DEFAULT 'member'
        `);
        console.log('ENUM updated to include new roles (temporarily keeping "admin").');

        // 2. Update existing 'admin' users to 'system_admin'
        const [result] = await connection.query(`
            UPDATE users SET role = 'system_admin' WHERE role = 'admin'
        `);
        console.log(`Updated ${result.affectedRows} users from "admin" to "system_admin".`);

        // 3. Optional: Remove 'admin' from ENUM if no one is using it anymore
        // await connection.query(\`
        //     ALTER TABLE users 
        //     MODIFY COLUMN role ENUM('system_admin', 'cep_admin', 'choir_header', 'member') DEFAULT 'member'
        // \`);
        // console.log('Cleaned up ENUM to remove "admin".');

        console.log('Migration successful!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
};

migrateRoles();
