import { createBrowserClient } from '@supabase/ssr';

export async function getSession(authToken: string | null) {
	// Initialize a Supabase client for server-side authentication
	const supabase = createBrowserClient(import.meta.env.VITE_PROJECT_URL, import.meta.env.VITE_DATABASE_PUB_KEY); // Use the service key for server-side requests)

	// Get the user from the Authorization header
	if (!authToken) return null;

	const { data: user, error } = await supabase.auth.getUser(authToken);

	if (error || !user) {
		console.error('Failed to authenticate user:', error?.message || 'No user found');
		return null;
	}
	return user;
}
