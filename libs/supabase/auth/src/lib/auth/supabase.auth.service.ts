import { SupabaseClientService } from '@agora/supabase/core';
import { Injectable, computed, inject, signal, type OnDestroy } from '@angular/core';
import type {
	AuthError,
	AuthResponse,
	OAuthResponse,
	Session,
	Subscription,
	User,
	UserResponse,
} from '@supabase/supabase-js';

enum OAuthProviders {
	GOOGLE = 'google',
	APPLE = 'apple',
}

@Injectable()
export class SupabaseAuth implements OnDestroy {
	private _session = signal<Session | null>(null);
	private _user = signal<User | null>(null);
	private _supabase = inject(SupabaseClientService);

	public readonly session = computed(() => this._session());
	public readonly user = computed(() => this._session()?.user);
	public readonly isAuthenticated = computed(() => !!this._session());
	public readonly isAnonymous = computed(() => this.user()?.is_anonymous);
	public readonly authToken = computed(() => this._session()?.access_token);
	public readonly userId = computed(() => this.user()?.id);

	sessionSub!: Subscription;

	constructor() {
		this._supabase.client.auth.getSession().then(({ data: { session } }) => {
			this._session.set(session);
		});

		const {
			data: { subscription },
		} = this._supabase.client.auth.onAuthStateChange((_event, session) => {
			this._session.set(session);
		});

		this.sessionSub = subscription;
	}

	/**
	 * Sign Up Methods ----------------------------
	 */

	async signUpWithEmail({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
		const res = await this._supabase.client.auth.signUp({
			email,
			password,
			// options: {
			//   emailRedirectTo: 'https://example.com/welcome',
			// },
		});
		return res;
	}

	/**
	 * Sign Up Converter Methods ----------------------------
	 */

	async convertToPermanentUserEmailPhone(): Promise<UserResponse> {
		// Might need to figure out what form of ID was given
		const res = await this._supabase.client.auth.updateUser({
			email: 'example@email.com',
		});
		return res;
	}

	async convertToPermanentUserOAuthProvider(provider: OAuthProviders): Promise<OAuthResponse> {
		const res = await this._supabase.client.auth.linkIdentity({
			provider,
		});
		return res;
	}

	/**
	 * Sign In Methods ----------------------------
	 */

	async signInAnon(): Promise<AuthResponse> {
		const res = await this._supabase.client.auth.signInAnonymously();
		return res;
	}

	async signInWithGoogle(): Promise<OAuthResponse> {
		const res = await this._supabase.client.auth.signInWithOAuth({
			provider: 'google',
			options: {
				queryParams: {
					access_type: 'offline',
					prompt: 'consent',
				},
			},
		});
		return res;
	}

	async handleSignInWithGoogle(response: google.accounts.id.CredentialResponse) {
		const { data, error } = await this._supabase.client.auth.signInWithIdToken({
			provider: 'google',
			token: response.credential,
		});
		if (data) {
			this._session.set(data.session);
			this._user.set(data.user);
		}

		return { data, error };
	}

	/**
	 * Sign Out Methods ----------------------------
	 */

	async signOut(): Promise<{
		error: AuthError | null;
	}> {
		const res = await this._supabase.client.auth.signOut();
		return res;
	}

	ngOnDestroy(): void {
		this.sessionSub.unsubscribe();
	}
}
