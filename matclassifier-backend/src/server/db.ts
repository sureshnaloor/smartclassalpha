import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../../shared/schema';
// import fs from 'fs';
// import path from 'path';

// Check for database URL environment variable
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create PostgreSQL client with SSL configuration for Lightsail
const client = postgres(process.env.DATABASE_URL, {
  ssl: {
    rejectUnauthorized: false,
    checkServerIdentity: () => undefined
  },
  connection: {
    application_name: 'matclassifier_app'
  },
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout
  max_lifetime: 60 * 30, // Close connections after 30 minutes
  onnotice: () => {}, // Suppress notice messages
  onparameter: () => {}, // Suppress parameter messages
});

// Create Drizzle ORM instance with our schema
export const db = drizzle(client, { schema }); 