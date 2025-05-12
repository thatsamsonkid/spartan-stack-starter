import { relations } from 'drizzle-orm/relations';
import { game, leaderboard, moves, profile, usersInAuth } from './schema';

export const leaderboardRelations = relations(leaderboard, ({ one }) => ({
	profile: one(profile, {
		fields: [leaderboard.playerId],
		references: [profile.id],
	}),
}));

export const profileRelations = relations(profile, ({ one, many }) => ({
	leaderboards: many(leaderboard),
	usersInAuth: one(usersInAuth, {
		fields: [profile.id],
		references: [usersInAuth.id],
	}),
	games_player1: many(game, {
		relationName: 'game_player1_profile_id',
	}),
	games_player2: many(game, {
		relationName: 'game_player2_profile_id',
	}),
	moves: many(moves),
}));

export const usersInAuthRelations = relations(usersInAuth, ({ many }) => ({
	profiles: many(profile),
}));

export const gameRelations = relations(game, ({ one }) => ({
	profile_player1: one(profile, {
		fields: [game.player1],
		references: [profile.id],
		relationName: 'game_player1_profile_id',
	}),
	profile_player2: one(profile, {
		fields: [game.player2],
		references: [profile.id],
		relationName: 'game_player2_profile_id',
	}),
}));

export const movesRelations = relations(moves, ({ one }) => ({
	profile: one(profile, {
		fields: [moves.playerId],
		references: [profile.id],
	}),
}));
