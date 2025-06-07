import { boolean, foreignKey, pgEnum, pgTable, primaryKey, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { authUsers } from 'drizzle-orm/supabase';

export const profile = pgTable(
	'profile',
	{
		id: uuid('id')
			.primaryKey()
			.notNull()
			.references(() => authUsers.id),
		created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
		name: varchar('name', { length: 256 }).notNull(),
		email: varchar('email', { length: 256 }),
	},
	(table) => [
		foreignKey({
			columns: [table.id],
			foreignColumns: [authUsers.id],
			name: 'profile_id_users_id_fk',
		}).onDelete('cascade'),
	],
).enableRLS();

// Todo-related enums and tables
export const todoStatusEnum = pgEnum('todo_status', ['pending', 'in_progress', 'completed']);
export const todoPriorityEnum = pgEnum('todo_priority', ['low', 'medium', 'high']);

export const categories = pgTable('categories', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	name: text('name').notNull(),
	color: text('color').notNull(),
	user_id: uuid('user_id')
		.notNull()
		.references(() => authUsers.id, { onDelete: 'cascade' }),
	created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}).enableRLS();

export const tags = pgTable('tags', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	name: text('name').notNull(),
	color: text('color').notNull(),
	user_id: uuid('user_id')
		.notNull()
		.references(() => authUsers.id, { onDelete: 'cascade' }),
	created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}).enableRLS();

export const todos = pgTable('todos', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	title: text('title').notNull(),
	description: text('description'),
	status: todoStatusEnum('status').default('pending').notNull(),
	priority: todoPriorityEnum('priority').default('medium').notNull(),
	due_date: timestamp('due_date', { withTimezone: true, mode: 'string' }),
	category_id: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
	user_id: uuid('user_id')
		.notNull()
		.references(() => authUsers.id, { onDelete: 'cascade' }),
	created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}).enableRLS();

export const todoTags = pgTable(
	'todo_tags',
	{
		todo_id: uuid('todo_id')
			.notNull()
			.references(() => todos.id, { onDelete: 'cascade' }),
		tag_id: uuid('tag_id')
			.notNull()
			.references(() => tags.id, { onDelete: 'cascade' }),
	},
	(table) => [primaryKey({ columns: [table.todo_id, table.tag_id] })],
).enableRLS();

export const sharedTodos = pgTable(
	'shared_todos',
	{
		todo_id: uuid('todo_id')
			.notNull()
			.references(() => todos.id, { onDelete: 'cascade' }),
		shared_with_user_id: uuid('shared_with_user_id')
			.notNull()
			.references(() => authUsers.id, { onDelete: 'cascade' }),
		can_edit: boolean('can_edit').default(false).notNull(),
		created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	},
	(table) => [primaryKey({ columns: [table.todo_id, table.shared_with_user_id] })],
).enableRLS();
