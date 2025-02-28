### SUpabase schema setup with auth

Set up the below before introspecting to handle issues with introspecting auth tables

```ts
const authSchema = pgSchema('auth');

export const users = authSchema.table('users', {
	id: uuid('id').primaryKey(),
});

export const profile = pgTable('profile', {
	// Matches id from auth.users table in Supabase
	id: uuid('id')
		.primaryKey()
		.references(() => users.id, { onDelete: 'cascade' }),
	name: varchar('name', { length: 256 }).notNull(),
	email: varchar('email', { length: 256 }),
	created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
```
