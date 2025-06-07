import { defineConfig } from "drizzle-kit";
import fs from 'fs';
import path from 'path';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is missing");
}

// Read the SSL certificate
// const sslCert = fs.readFileSync(path.join(process.cwd(), 'rds-ca-2019-root.pem')).toString();

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    // ssl: {
    //   ca: sslCert
    // }
  },
});
