import { SupabaseAuth } from '@agora/supabase/auth';
import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TrpcHeaders } from '../trpc-client';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	template: '<router-outlet/>',
})
export class AppComponent {
	private readonly _authService = inject(SupabaseAuth);

	constructor() {
		effect(() =>
			TrpcHeaders.update((h) => ({
				...h,
				authorization: this._authService.isAuthenticated() ? `Bearer ${this._authService.authToken()}` : undefined,
			})),
		);
	}
}
