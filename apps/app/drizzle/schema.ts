import {
	bigint,
	foreignKey,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	smallint,
	timestamp,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';

export const gameStatus = pgEnum('game_status', ['queued', 'in-progress', 'complete', 'paused']);

export const leaderboard = pgTable(
	'leaderboard',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: 'number' }).primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
		gameId: uuid('game_id'),
		playerId: uuid('player_id'),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		score: bigint({ mode: 'number' }),
	},
	(table) => [
		foreignKey({
			columns: [table.playerId],
			foreignColumns: [profile.id],
			name: 'leaderboard_player_id_profile_id_fk',
		}),
	],
);

export const profile = pgTable(
	'profile',
	{
		id: uuid().primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
		name: varchar({ length: 256 }).notNull(),
		email: varchar({ length: 256 }),
	},
	(table) => [
		foreignKey({
			columns: [table.id],
			foreignColumns: [users.id],
			name: 'profile_id_users_id_fk',
		}).onDelete('cascade'),
	],
);

export const game = pgTable(
	'game',
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
		player1: uuid('player_1'),
		player2: uuid('player_2'),
		gameStatus: gameStatus('game_status').default('queued').notNull(),
		player1Symbol: integer('player_1_symbol').default(0).notNull(),
		player2Symbol: integer('player_2_symbol').default(1).notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.player1],
			foreignColumns: [profile.id],
			name: 'game_player_1_profile_id_fk',
		}),
		foreignKey({
			columns: [table.player2],
			foreignColumns: [profile.id],
			name: 'game_player_2_profile_id_fk',
		}),
	],
);

export const moves = pgTable(
	'moves',
	{
		id: serial().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
		gameId: uuid('game_id').notNull(),
		playerId: uuid('player_id'),
		symbol: smallint(),
		row: integer(),
		column: integer(),
	},
	(table) => [
		foreignKey({
			columns: [table.playerId],
			foreignColumns: [profile.id],
			name: 'moves_player_id_profile_id_fk',
		}),
		primaryKey({
			columns: [table.id, table.gameId],
			name: 'moves_game_id_id_pk',
		}),
	],
);
