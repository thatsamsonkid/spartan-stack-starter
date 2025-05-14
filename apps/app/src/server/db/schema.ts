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

// export const gameStatusEnum = pgEnum('game_status', ['queued', 'in-progress', 'paused', 'complete']);

// export const game = pgTable(
// 	'game',
// 	{
// 		id: uuid('id').defaultRandom().primaryKey().notNull(),
// 		created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
// 		player_1: uuid('player_1').references(() => profile.id),
// 		player_2: uuid('player_2').references(() => profile.id),
// 		game_status: gameStatusEnum().default('queued').notNull(),
// 		player1Symbol: text('player_1_symbol').default('default-player-1.svg').notNull(),
// 		player2Symbol: text('player_2_symbol').default('default-player-2.svg').notNull(),
// 		winner: uuid('winner').references(() => profile.id),
// 		player1Ready: timestamp('player_1_ready'),
// 		player2Ready: timestamp('player_2_ready'),
// 	},
// 	(table) => [
// 		foreignKey({
// 			columns: [table.player_1],
// 			foreignColumns: [profile.id],
// 			name: 'game_player_1_profile_id_fk',
// 		}),
// 		foreignKey({
// 			columns: [table.player_2],
// 			foreignColumns: [profile.id],
// 			name: 'game_player_2_profile_id_fk',
// 		}),
// 		foreignKey({
// 			columns: [table.winner],
// 			foreignColumns: [profile.id],
// 			name: 'game_winner_profile_id_fk',
// 		}),
// 	],
// );

// export const leaderboard = pgTable(
// 	'leaderboard',
// 	{
// 		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
// 		id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
// 		created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
// 		game_id: uuid('game_id'),
// 		player_id: uuid('player_id').references(() => profile.id),
// 		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
// 		score: bigint('score', { mode: 'number' }),
// 	},
// 	(table) => [
// 		foreignKey({
// 			columns: [table.player_id],
// 			foreignColumns: [profile.id],
// 			name: 'leaderboard_player_id_profile_id_fk',
// 		}),
// 	],
// );

// export const moves = pgTable(
// 	'moves',
// 	{
// 		id: serial('id').notNull(),
// 		created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
// 		game_id: uuid('game_id').notNull(),
// 		player_id: uuid('player_id').references(() => profile.id),
// 		symbol: smallint('symbol'),
// 		row: integer('row'),
// 		column: integer('column'),
// 	},
// 	(table) => [
// 		foreignKey({
// 			columns: [table.player_id],
// 			foreignColumns: [profile.id],
// 			name: 'moves_player_id_profile_id_fk',
// 		}),
// 		primaryKey({
// 			columns: [table.id, table.game_id],
// 			name: 'moves_game_id_id_pk',
// 		}),
// 	],
// );

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
