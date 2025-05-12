import { SupabaseAuth } from '@agora/supabase/auth';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmAvatarModule } from '@spartan-ng/ui-avatar-helm';

@Component({
	selector: 'app-header',
	imports: [RouterLink, HlmAvatarModule],
	template: `
		<header class="flex justify-center px-4 py-5 shadow">
			<a routerLink="/">
				<img src="/assets/logo.svg" alt="spar-tan-toe logo" />
			</a>
			@if (isSignedIn() && !isAnon()) {
				<hlm-avatar variant="medium">
					<img [src]="profilePic()" alt="spartan logo. Resembling a spartan shield" hlmAvatarImage />
					<span class="bg-[#FD005B] text-white" hlmAvatarFallback>RG</span>
				</hlm-avatar>
			}
		</header>
	`,
})
export class HeaderComponent {
	private readonly _auth = inject(SupabaseAuth);
	protected isSignedIn = computed(() => this._auth.session());
	protected isAnon = computed(() => this._auth.user()?.is_anonymous);
	protected profilePic = computed(() => this.isSignedIn()?.user?.user_metadata.picture);
}
