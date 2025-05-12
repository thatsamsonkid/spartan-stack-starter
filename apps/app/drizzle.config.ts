import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import path from 'node:path';

dotenv.config({
	//  path: path.join(__dirname, './.env.local')
	path: path.join(__dirname, './.env.production'),
});

export default defineConfig({
	schema: ['./apps/spar-tan-toe/src/server/db/schema.ts'],
	dialect: 'postgresql',
	schemaFilter: ['public'],
	out: 'apps/spar-tan-toe/drizzle',
	dbCredentials: {
		url: process.env.DATABASE_URL || '',
	},
	verbose: true,
	strict: true,
});
