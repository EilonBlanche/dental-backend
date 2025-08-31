const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const runMigration = async () => {
  try {
    await client.connect();
    console.log('Connected to database.');

    const sql = fs.readFileSync('./migration/migrate.sql', 'utf-8');
    await client.query(sql);

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
};

runMigration();
