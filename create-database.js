import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  try {
    // Connect to the default 'postgres' database first
    const connectionString = process.env.DATABASE_URL?.replace(/\/[^\/]+$/, '/postgres') || 
      'postgresql://postgres:your_password@ls-4d6578296fb3e611797330f7a5ee2f60b4b758d3.c7kca0mumhdp.eu-central-1.rds.amazonaws.com:5432/postgres';
    
    console.log('Connecting to PostgreSQL...');
    const sql = postgres(connectionString);
    
    // Create the database
    console.log('Creating database...');
    await sql`CREATE DATABASE smartclass_db`;
    
    console.log('Database created successfully!');
    
    // Close the connection
    await sql.end();
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('Database already exists!');
    } else {
      console.error('Error creating database:', error.message);
    }
  }
}

createDatabase(); 