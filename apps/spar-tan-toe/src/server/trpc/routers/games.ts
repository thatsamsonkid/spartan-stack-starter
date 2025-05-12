import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { getDbConnection } from '../../db/db';
import { game } from '../../db/schema';
import { authProcedure, publicProcedure, router } from '../trpc';

async function executeDbOperation(operation: () => Promise<any>, errorMsg: string) {
	try {
		const result = await operation();
		if (!result || result.length === 0) {
			throw new Error(errorMsg);
		}
		return result;
	} catch (error) {
		console.error(error);
		throw new TRPCError({
			code: 'INTERNAL_SERVER_ERROR',
			message: errorMsg,
			cause: error,
		});
	}
}

export const gameRouter = router({
	create: authProcedure.mutation(async ({ ctx }) => {
		if (!ctx.supabase?.user) {
			throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthenticated' });
		}
		return executeDbOperation(
			() => getDbConnection().db.insert(game).values({ player_1: ctx.supabase.user?.id }).returning(),
			'Failed to create a new game',
		).then((result) => ({ data: result[0], error: null }));
	}),
	join: authProcedure.input(z.object({ gameId: z.string() })).mutation(async ({ ctx, input }) => {
		return executeDbOperation(
			() =>
				getDbConnection()
					.db.update(game)
					.set({ player_2: ctx.supabase.user?.id })
					.where(eq(game.id, input.gameId))
					.returning(),
			'Failed to join the game',
		).then((result) => result[0]);
	}),
	updateWinner: authProcedure
		.input(z.object({ gameId: z.string(), winnerId: z.string() }))
		.mutation(async ({ input }) => {
			return executeDbOperation(
				() =>
					db
						.update(game)
						.set({ winner: input.winnerId, game_status: 'complete' })
						.where(eq(game.id, input.gameId))
						.returning(),
				'Failed to update the winner',
			).then((result) => result[0]);
		}),
	findGame: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input }) =>
			executeDbOperation(
				() => getDbConnection().db.select().from(game).where(eq(game.id, input.id)),
				'Failed to select the game',
			),
		),
});
