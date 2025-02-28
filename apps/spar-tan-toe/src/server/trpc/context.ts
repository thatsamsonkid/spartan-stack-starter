import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import type { inferAsyncReturnType } from '@trpc/server';
import { getHeaders, getRequestHeader, type H3Event } from 'h3';
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
	const supabase = createServerClient(import.meta.env.VITE_PROJECT_URL, import.meta.env.VITE_DATABASE_PUB_KEY, {
		cookies: {
			getAll() {
				return parseCookieHeader(getHeaders(event).Cookie ?? '');
			},
			setAll(cookiesToSet) {
				for (const cookie of cookiesToSet) {
					event.context.res.appendHeader(
						'Set-Cookie',
						serializeCookieHeader(cookie.name, cookie.value, cookie.options),
					);
				}
			},
		},
	});

	// const contextInner = await createContextInner({ supabase })
	const authToken = authorization?.split(' ')[1];
	const { data, error } = await supabase.auth.getUser(authToken);

	if (error) {
		event.respondWith(new Response(''));
	}

	return {
		isAuthed: authToken && authToken?.length > 0,
		authToken: authToken,
		supabase: data,
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
