import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { getDbConnection } from '../../db/db';
import { game, moves } from '../../db/schema';
import { publicProcedure, router } from '../trpc';

export const movesRouter = router({
	create: publicProcedure
		.input(
			z.object({
				gameId: z.string(),
				playerId: z.string(),
				row: z.number(),
				column: z.number(),
				symbol: z.number(),
			}),
		)
		.mutation(async ({ input }) => {
			return await getDbConnection().db
				.insert(moves)
				.values({
					game_id: input.gameId,
					player_id: input.playerId,
					row: input.row,
					column: input.column,
					symbol: input.symbol,
				})
				.returning({ id: game.id });
		}),
	select: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(async ({ input }) => await getDbConnection().db.select().from(moves).where(eq(moves.game_id, input.id))),
});
