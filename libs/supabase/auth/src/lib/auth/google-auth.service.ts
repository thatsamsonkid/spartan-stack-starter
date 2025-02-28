import { ScriptLoaderService } from '@agora/script-loader';
import { EventEmitter, Injectable, inject } from '@angular/core';
import { AsyncSubject, BehaviorSubject, filter, skip, type Observable } from 'rxjs';
import { GOOGLE_CLIENT_ID, GOOGLE_INIT_OPTIONS } from './google-token';
import type { SocialUser } from './socialuser';
import { SupabaseAuth } from './supabase.auth.service';

declare let google: any;

export interface GoogleInitOptions {
	/**
	 * enables the One Tap mechanism, and makes auto-login possible
	 */
	oneTapEnabled?: boolean;
	/**
	 * list of permission scopes to grant in case we request an access token
	 */
	scopes?: string | string[];
	/**
	 * This attribute sets the DOM ID of the container element. If it's not set, the One Tap prompt is displayed in the top-right corner of the window.
	 */
	prompt_parent_id?: string;

	/**
	 * Optional, defaults to 'select_account'.
	 * A space-delimited, case-sensitive list of prompts to present the
	 * user.
	 * Possible values are:
	 * empty string The user will be prompted only the first time your
	 *     app requests access. Cannot be specified with other values.
	 * 'none' Do not display any authentication or consent screens. Must
	 *     not be specified with other values.
	 * 'consent' Prompt the user for consent.
	 * 'select_account' Prompt the user to select an account.
	 */
	prompt?: '' | 'none' | 'consent' | 'select_account';
}

const defaultInitOptions: GoogleInitOptions = {
	oneTapEnabled: true,
};

@Injectable()
export class GoogleAuthService {
	public readonly PROVIDER_ID: string = 'GOOGLE';
	private _authService = inject(SupabaseAuth);
	private scriptLoader = inject(ScriptLoaderService);
	private readonly clientId = inject(GOOGLE_CLIENT_ID);
	private readonly initOptions = inject(GOOGLE_INIT_OPTIONS, {
		optional: true,
	});

	public readonly changeUser = new EventEmitter<SocialUser | null>();

	private readonly _socialUser = new BehaviorSubject<SocialUser | null>(null);
	private readonly _accessToken = new BehaviorSubject<string | null>(null);
	private readonly _receivedAccessToken = new EventEmitter<string>();
	private _tokenClient: google.accounts.oauth2.TokenClient | undefined;

	/* Consider making this an enum comprising LOADING, LOADED, FAILED etc. */
	private initialized = false;
	private _initState: AsyncSubject<boolean> = new AsyncSubject();

	/** An `Observable` that one can subscribe to get the current logged in user information */
	//   get authState(): Observable<SocialUser> {
	//     return this._authState.asObservable();
	//   }

	/** An `Observable` to communicate the readiness of the service and associated login providers */
	get initState(): Observable<boolean> {
		return this._initState.asObservable();
	}

	constructor() {
		this.initOptions = { ...defaultInitOptions, ...this.initOptions };

		// emit changeUser events but skip initial value from behaviorSubject
		this._socialUser.pipe(skip(1)).subscribe(this.changeUser);

		// emit receivedAccessToken but skip initial value from behaviorSubject
		// this._accessToken.pipe(skip(1)).subscribe(this._receivedAccessToken);
		if (!this._authService.isAuthenticated()) {
			this.initialize();
		}
	}

	initialize(autoLogin?: boolean): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				this.scriptLoader.loadScript(this.PROVIDER_ID, 'https://accounts.google.com/gsi/client', () => {
					google.accounts.id.initialize({
						client_id: this.clientId,
						auto_select: autoLogin || true,
						callback: (credentialResponse: google.accounts.id.CredentialResponse) => {
							console.log(credentialResponse);
							this._authService.handleSignInWithGoogle(credentialResponse);
							// const socialUser = this.createSocialUser(credential);
							// this._socialUser.next(socialUser);
						},
						prompt_parent_id: this.initOptions?.prompt_parent_id,
						itp_support: this.initOptions?.oneTapEnabled,
					});

					if (this.initOptions?.oneTapEnabled) {
						this._socialUser
							.pipe(filter((user) => user === null))
							.subscribe(() => google!.accounts.id.prompt(console.debug));
					}

					if (this.initOptions?.scopes) {
						const scope = Array.isArray(this.initOptions.scopes)
							? this.initOptions.scopes.filter((s: unknown) => s).join(' ')
							: this.initOptions.scopes;

						this._tokenClient = google!.accounts.oauth2.initTokenClient({
							client_id: this.clientId,
							scope,
							prompt: this.initOptions.prompt,
							callback: (tokenResponse: any) => {
								console.log(tokenResponse);
								if (tokenResponse.error) {
									this._accessToken.error({
										code: tokenResponse.error,
										description: tokenResponse.error_description,
										uri: tokenResponse.error_uri,
									});
								} else {
									this._accessToken.next(tokenResponse.access_token);
								}
							},
						});
					}

					this.initialized = true;
					this._initState.next(this.initialized);
					this._initState.complete();

					resolve();
				});
			} catch (err) {
				this.initialized = true;
				this._initState.next(this.initialized);
				this._initState.complete();

				reject(err);
			}
		});
	}

	async signOut(): Promise<void> {
		google.accounts.id.disableAutoSelect();
		this._socialUser.next(null);
	}

	private createSocialUser(idToken: string): SocialUser {
		const payload = this.decodeJwt(idToken);
		return {
			idToken: idToken,
			id: payload.sub || '',
			name: payload.name || '',
			email: payload.email || '',
			photoUrl: payload.picture || '',
			firstName: payload.given_name || '',
			lastName: payload.family_name || '',
		};
	}

	private decodeJwt(idToken: string): Record<string, string | undefined> {
		const base64Url = idToken.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split('')
				.map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
				.join(''),
		);
		return JSON.parse(jsonPayload);
	}
}
