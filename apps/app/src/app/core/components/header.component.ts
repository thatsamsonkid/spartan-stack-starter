import { SupabaseAuth } from '@agora/supabase/auth';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmAvatarModule } from '@spartan-ng/ui-avatar-helm';

@Component({
	selector: 'app-header',
	imports: [RouterLink, HlmAvatarModule],
	host: {
		class: 'w-full shadow flex',
	},
	template: `
		<header class="mx-auto flex h-[50px] w-full max-w-screen-xl px-4">
			<a class="flex justify-center" routerLink="/">
				<img class="w-10 py-2.5" src="/assets/spartan.svg" alt="app logo" />
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
