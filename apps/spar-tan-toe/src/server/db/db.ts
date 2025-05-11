// import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Create a function to get a new database connection
export const getDbConnection = () => {
  const client = postgres(process.env.DATABASE_URL ?? '', {
    prepare: false,
    max: 1, // Limit to 1 connection per request
    idle_timeout: 20, // Close idle connections after 20 seconds
  });

  const db = drizzle(client);

  return {
    db,
    cleanup: async () => {
      try {
        await client.end();
      } catch (error) {
        console.error('Error cleaning up database connection:', error);
      }
    },
  };
};

// For migrations only
export const migrateToLatest = async () => {
  const { db, cleanup } = getDbConnection();
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
  } finally {
    await cleanup();
  }
};