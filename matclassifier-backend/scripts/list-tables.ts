import 'dotenv/config';
import { db } from '../server/db';

async function listTables() {
  try {
    console.log('Connecting to database...');
    
    // SQL query to list all tables in the public schema
    const tables = await db.execute(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public' 
       ORDER BY table_name`
    );
    
    console.log('Tables in the public schema:');
    console.log(tables);
    
    // Check if the ai_settings table exists and has data
    const settings = await db.execute(
      `SELECT * FROM ai_settings LIMIT 5`
    );
    
    console.log('\nAI Settings:');
    console.log(settings);
    
    // Check if the materials table exists and has data
    const materials = await db.execute(
      `SELECT * FROM materials LIMIT 5`
    );
    
    console.log('\nMaterials:');
    console.log(materials);
    
    console.log('\nDatabase check complete.');
  } catch (error) {
    console.error('Error checking database:', error);
  }
}

listTables().then(() => process.exit()); 