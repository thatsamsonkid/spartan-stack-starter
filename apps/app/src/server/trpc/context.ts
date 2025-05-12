import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import type { inferAsyncReturnType } from '@trpc/server';
import { getHeaders, getRequestHeader, H3Event } from 'h3';
import { getDbConnection } from '../db/db';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */

// Splitting context and having supabase available in inner context on all procedures could be handy

// inner context
// interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
// 	supabase: SupabaseClient | null
// }

// outer context
// export async function createContextInner(opts?: CreateInnerContextOptions) {
// 	return {
// 		supabase: (opts?.supabase as SupabaseClient) ?? null,
// 	}
// }

export async function createContext(event: H3Event) {
	const authorization = getRequestHeader(event, 'authorization');
	const authToken = authorization?.split(' ')[1];

	const supabase = createServerClient(process.env.VITE_PROJECT_URL || '', process.env.VITE_DATABASE_PUB_KEY || '', {
		cookies: {
			get(name: string) {
				const cookies = parseCookieHeader(getHeaders(event).Cookie ?? '');
				const cookie = cookies.find((c) => c.name === name);
				return cookie?.value || '';
			},
			set(name: string, value: string, options: any) {
				event.context.res.appendHeader('Set-Cookie', serializeCookieHeader(name, value, options));
			},
			remove(name: string, options: any) {
				event.context.res.appendHeader('Set-Cookie', serializeCookieHeader(name, '', { ...options, maxAge: -1 }));
			},
		},
		global: {
			headers: {
				Authorization: authorization || '',
			},
		},
	});

	let user = null;

	if (authToken) {
		const {
			data: { user: userData },
			error,
		} = await supabase.auth.getUser(authToken);
		if (!error) {
			user = userData;
		}
	}

	// Get a new database connection for this request
	const { db, cleanup } = getDbConnection();

	return {
		isAuthenticated: !!user,
		authToken,
		supabase,
		user,
		db,
		cleanup,
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
