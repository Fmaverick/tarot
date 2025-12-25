import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const dbName = 'tarot';
// Connect to default 'postgres' database to create the new one
const connectionString = process.env.PG_URL!.replace(`/${dbName}`, '/postgres').split('?')[0];

const sql = postgres(connectionString);

async function init() {
  console.log(`Checking if database '${dbName}' exists...`);
  const result = await sql`SELECT 1 FROM pg_database WHERE datname = ${dbName}`;
  
  if (result.length === 0) {
    console.log(`Creating database '${dbName}'...`);
    await sql`CREATE DATABASE ${sql(dbName)}`;
    console.log('Database created successfully.');
  } else {
    console.log('Database already exists.');
  }
  
  await sql.end();
}

init().catch(console.error);
