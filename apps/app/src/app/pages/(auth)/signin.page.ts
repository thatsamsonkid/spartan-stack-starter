import { GoogleSigninButtonDirective, SupabaseAuth } from '@agora/supabase/auth';
import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';
import { unauthenticatedGuard } from './guards/unauthenticated.guard';

export const routeMeta: RouteMeta = {
	title: 'About Analog',
	canActivate: [unauthenticatedGuard],
	// providers: [AboutService],
};

@Component({
	selector: 'app-sign-in',
	imports: [HlmCardModule, GoogleSigninButtonDirective],
	host: {
		class: 'min-h-screen min-w-screen',
	},
	template: `
		<main class="min-w-screen flex min-h-screen items-center justify-center">
			<section hlmCard>
				<div hlmCardHeader>
					<h3 hlmCardTitle>Welcome to spar-tan-toe!</h3>
					<!-- <p hlmCardDescription>Card Description</p> -->
				</div>
				<div hlmCardContent>
					@if (!isSigned()) {
						<ul class="flex flex-col gap-3">
							<li class="flex justify-center">
								<google-signin-button type="standard" size="large" theme="filled_black" />
							</li>
						</ul>
					} @else {
						<button>Start a new Game</button>
					}
				</div>
			</section>
		</main>
	`,
})
export default class SignInPageComponent {
	private readonly _auth = inject(SupabaseAuth);
	protected isSigned = computed(() => this._auth.session());

	onGoogleSignIn(credential: any) {
		this._auth.handleSignInWithGoogle(credential);
	}
}
