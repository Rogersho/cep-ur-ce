const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection without specifying the database first
const createDbAndTables = async () => {
    let connection;
    try {
        console.log('Connecting to MySQL server...');
        console.log(`Connecting to MySQL server at ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}...`);
        connection = await mysql.createConnection({
            host: (process.env.DB_HOST || '').trim(),
            user: (process.env.DB_USER || '').trim(),
            password: (process.env.DB_PASS || '').trim(),
            port: parseInt(process.env.DB_PORT) || 3306,
            ssl: {
                rejectUnauthorized: false
            }
        });

        // 1. Create the database if it doesn't exist
        console.log(`Checking if database ${process.env.DB_NAME} exists...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log(`Database ${process.env.DB_NAME} ready.`);

        // Switch to the database
        await connection.query(`USE \`${process.env.DB_NAME}\`;`);

        // 2. Read the schema.sql file
        const schemaPath = path.join(__dirname, '../../../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split the schema into individual statements
        // This is a naive split by semicolon and handles our specific schema structure.
        const statements = schema
            .split(';')
            .filter(stmt => stmt.trim() !== '')
            .map(stmt => stmt.trim() + ';');


        console.log('Executing schema initialization scripts...');

        let successCount = 0;
        // Execute each SQL statement
        for (const statement of statements) {
            // Skip the CREATE DATABASE and USE statements inside the file since we already did it
            if (statement.toUpperCase().startsWith('CREATE DATABASE') || statement.toUpperCase().startsWith('USE')) {
                continue;
            }

            try {
                await connection.query(statement);
                successCount++;
            } catch (err) {
                // Safely ignore duplicate key errors for the default admin user insertion
                if (err.code !== 'ER_DUP_ENTRY') {
                    console.error('Error executing statement: ', err.message);
                    console.error('Statement was: ', statement);
                }
            }
        }

        console.log(`Schema initialization completed. Executed ${successCount} statements successfully.`);

    } catch (error) {
        console.error('Database Initialization failed:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = createDbAndTables;
