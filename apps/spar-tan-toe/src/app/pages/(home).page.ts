import { SupabaseAuth } from '@agora/supabase/auth';
import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal, type OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';
import { HlmToasterModule } from '@spartan-ng/ui-sonner-helm';
import { toast } from 'ngx-sonner';
import { HeaderComponent } from '../core/components/header.component';
import { anonAuthGuard } from '../core/guards/anon-auth.guard';
import { GameManagerService } from '../core/services/game-manager.service';
import { AuthStore } from '../store/auth.store';
import { GameStore } from '../store/game/games.store';

export const routeMeta: RouteMeta = {
	canActivate: [anonAuthGuard],
};

@Component({
    selector: 'spartan-toe-home',
    imports: [HlmCardModule, HlmToasterModule, RouterLink, HeaderComponent, HlmButtonDirective],
    host: {
        class: 'min-h-screen min-w-screen',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
		<app-header />
		<main class="min-w-screen flex min-h-screen items-center justify-center">
			<section hlmCard>
				<div hlmCardHeader>
					<h3 hlmCardTitle>Welcome to spar-tan-toe!</h3>
				</div>
				<div hlmCardContent class="text-center">
					@if (!isSigned() || isAnon()) {
						<ul class="flex flex-col gap-3">
							<!-- <li>
								<a hlmBtn class="w-full" routerLink="/signin" (click)="signIn()">Sign In</a>
							</li>
							<li>
								<a hlmBtn class="w-full" (click)="signUp()">Sign Up</a>
							</li> -->
							<hr class="my-2" />
							<li>
								<button hlmBtn class="w-full" (click)="startNewGame()">Just Start New game</button>
							</li>
						</ul>
					} @else {
						<button hlmBtn (click)="startNewGame()">Start a new Game</button>
					}
				</div>
			</section>
			<hlm-toaster />
		</main>
	`
})
export default class HomeComponent implements OnInit {
	private readonly _authStore = inject(AuthStore);
	private readonly _gameStore = inject(GameStore);

	private readonly _auth = inject(SupabaseAuth);
	private readonly _gameManagerService = inject(GameManagerService);
	private readonly _router = inject(Router);
	private readonly _destroyRef = inject(DestroyRef);

	protected isSigned = computed(() => this._auth.session());
	protected isAnon = computed(() => this._auth.user()?.is_anonymous);
	protected readonly toast = toast;
	protected loading = signal(false);

	ngOnInit(): void {
		const navigation = this._router.getCurrentNavigation();
		if (navigation?.extras?.state?.error) {
			this.toast(navigation.extras.state.error);
		}
	}

	protected async startNewGame(): Promise<void> {
		// this.listenToRouteEvents();
		console.log('dmsalkml');
		try {
			console.log(this._authStore.isAuthticated());
			if (!this._authStore.isAuthticated()) {
				const { error: authError } = await this._authStore.signInAnonymously();
				if (authError) {
					throw new Error('Failed to create anon profile');
				}
				// await this._createNewGame();
				await this._gameStore.createGame();
			} else {
				await this._gameStore.createGame();
			}
		} catch (error) {
			console.log(error);
			this.toast('Seem to be running into a temporary issue, try again later!');
		}
	}

	// 	private navigateToGame():void
	// {

	// }
	// private async _createNewGame(): Promise<void> {
	// 	const { data: game } = await firstValueFrom(this._gameManagerService.startNewGame());
	// 	console.log('GameID', game);

	// 	if (game?.id) {
	// 		this._router.navigate(['game', game.id, 'lobby']);
	// 	} else {
	// 		throw new Error('Failed to create game');
	// 	}
	// }

	// private listenToRouteEvents() {
	// 	this._router.events.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((event: Event) => {
	// 		switch (true) {
	// 			case event instanceof NavigationStart: {
	// 				this.loading.set(true);
	// 				break;
	// 			}

	// 			case event instanceof NavigationEnd:
	// 			case event instanceof NavigationCancel:
	// 			case event instanceof NavigationError: {
	// 				this.loading.set(false);
	// 				break;
	// 			}
	// 			default: {
	// 				break;
	// 			}
	// 		}
	// 	});
	// }
}
