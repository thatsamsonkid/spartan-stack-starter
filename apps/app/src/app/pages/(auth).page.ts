import { SupabaseAuth } from '@agora/supabase/auth';
import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-auth-page',
	imports: [RouterOutlet],
	template: ' <router-outlet/> ',
})
export default class AuthPageComponent {
	// private readonly route = inject(ActivatedRoute);
	private readonly _authService = inject(SupabaseAuth);
	private readonly _router = inject(Router);

	constructor() {
		effect(() => {
			if (this._authService.isAuthenticated()) {
				this._router.navigate(['/']);
			}
		});
	}
}
