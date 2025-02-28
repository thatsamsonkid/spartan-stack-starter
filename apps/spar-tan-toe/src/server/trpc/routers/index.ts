import { router } from '../trpc';
import { gameRouter } from './games';
import { movesRouter } from './moves';
// import { noteRouter } from './notes';

export const appRouter = router({
	game: gameRouter,
	moves: movesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
