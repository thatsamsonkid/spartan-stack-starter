import { TRPCError, initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';
import type { Context } from './context';

interface Meta {
	authRequired: boolean;
}

const t = initTRPC
	.context<Context>()
	.meta<Meta>()
	.create({
		// Set a default value
		defaultMeta: { authRequired: false },
		transformer: SuperJSON,
	});

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Auth Middleware procedure
 **/
export const authMiddleware = t.middleware(async (opts) => {
	const { ctx, next } = opts;

	// Access options from the input object
	const authToken = ctx?.authToken ?? null;

	// const session = await getSession(authToken) // Retrieve session based on request context
	if (!authToken) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'You must be logged in to access this resource',
		});
	}
	return next({
		ctx: {
			...ctx,
			// session,
		},
	});
});

/**
 * Authed procedure
 **/
export const authProcedure = publicProcedure.use(authMiddleware).meta({
	authRequired: true,
});

export const router = t.router;
export const middleware = t.middleware;
