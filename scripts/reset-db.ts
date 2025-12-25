import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const dbName = 'tarot';
const connectionString = process.env.PG_URL!.replace(`/${dbName}`, '/postgres').split('?')[0];

const sql = postgres(connectionString);

async function reset() {
  console.log(`Dropping database '${dbName}'...`);
  // Force drop by terminating connections
  await sql`SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = ${dbName}
    AND pid <> pg_backend_pid()`;
    
  await sql`DROP DATABASE IF EXISTS ${sql(dbName)}`;
  
  console.log(`Creating database '${dbName}'...`);
  await sql`CREATE DATABASE ${sql(dbName)}`;
  
  console.log('Database reset successfully.');
  await sql.end();
}

reset().catch(console.error);
