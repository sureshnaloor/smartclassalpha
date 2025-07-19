import { defineConfig } from "drizzle-kit";
// import fs from 'fs';
// import path from 'path';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is missing");
}

// Determine SSL configuration based on environment
const isProduction = process.env.NODE_ENV === 'production';
const sslConfig = isProduction ? {
  rejectUnauthorized: false,
  checkServerIdentity: () => undefined
} : false;

// Read the SSL certificate
// const sslCert = fs.readFileSync(path.join(process.cwd(), 'rds-ca-2019-root.pem')).toString();

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl: sslConfig
  },
});
