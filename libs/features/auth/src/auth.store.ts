import { SupabaseAuth } from '@agora/supabase/auth';
import { SupabaseClientService } from '@agora/supabase/core';
import { computed, inject } from '@angular/core';
import { signalStoreFeature, withComputed, withMethods, withProps, withState } from '@ngrx/signals';

export type AuthState = { user: null };

export function withAuth() {
	return signalStoreFeature(
		withProps(() => ({
			supabase: inject(SupabaseClientService),
		})),
		withState<AuthState>({ user: null }),
		withMethods(({ supabase }) => ({
			async signInAnonymously() {
				return await supabase.client.auth.signInAnonymously();
			},
			async getSession() {
				return await supabase.client.auth.getSession();
			},
		})),
		withComputed((state, authService = inject(SupabaseAuth)) => ({
			isAuthticated: computed(() => !!authService.session()),
			isSignedIn: computed(() => authService.session()),
			user: computed(() => authService.user()),
			userId: computed(() => authService.userId()),
		})),
	);
}
