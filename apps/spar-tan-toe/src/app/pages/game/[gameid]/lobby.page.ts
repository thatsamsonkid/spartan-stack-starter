import { NAVIGATOR_TOKEN } from '@/utils';
import { Component, computed, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideChevronUp } from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { HlmToasterModule } from '@spartan-ng/ui-sonner-helm';
import { toast } from 'ngx-sonner';
import { GameStore } from '../../../store/game/games.store';
import { ChallengersComponent } from '../components/challengers.component';

@Component({
	selector: 'app-lobby-page',
	imports: [ChallengersComponent, HlmButtonDirective, HlmToasterModule, BrnSelectImports, HlmSelectImports],
	providers: [provideIcons({ lucideChevronUp, lucideChevronDown })],
	template: `
		<div class="m-auto w-full max-w-lg space-y-6 p-6">
			<div>
				<h1 class="text-2xl">Game Lobby</h1>
				<app-game-challengers [players]="this.connectedPlayers()" />
			</div>

			<!-- Avatar Selection -->
			<!-- <div class="mb-6">
				<h2 class="mb-4 text-xl font-bold">Select Your Avatar</h2>
				<div class="grid grid-cols-3 gap-4">
					<button class="h-16 w-16 rounded-lg bg-gray-300 hover:bg-gray-400">👾</button>
					<button class="h-16 w-16 rounded-lg bg-gray-300 hover:bg-gray-400">🐱</button>
					<button class="h-16 w-16 rounded-lg bg-gray-300 hover:bg-gray-400">🐻</button>
					<button class="h-16 w-16 rounded-lg bg-gray-300 hover:bg-gray-400">🐉</button>
					<button class="h-16 w-16 rounded-lg bg-gray-300 hover:bg-gray-400">🦊</button>
					<button class="h-16 w-16 rounded-lg bg-gray-300 hover:bg-gray-400">🐸</button>
					<button class="h-16 w-16 rounded-lg bg-gray-300 hover:bg-gray-400">🐧</button>
					<button class="h-16 w-16 rounded-lg bg-gray-300 hover:bg-gray-400">🐺</button>
					<button class="h-16 w-16 rounded-lg bg-gray-300 hover:bg-gray-400">🦄</button>
				</div>
			</div> -->
			<div>
				<h2 class="mb-4 text-xl font-bold">Game Settings</h2>
				<!-- Turn Timer Selection -->
				<hlm-select class="inline-block" placeholder="Set Turn Time Limit">
					<hlm-select-trigger class="w-56">
						<hlm-select-value />
					</hlm-select-trigger>
					<hlm-select-content>
						<hlm-option value="30">30 Seconds</hlm-option>
						<hlm-option value="60">1 Minute</hlm-option>
						<hlm-option value="120">2 Minutes</hlm-option>
						<hlm-option value="300">3 Minutes</hlm-option>
					</hlm-select-content>
				</hlm-select>
			</div>

			<!-- Copy Link Button -->
			<div class="mt-4">
				@if (isClipboardAvailable()) {
					<button hlmBtn (click)="copyLink()">Copy Game Link</button>
				}
			</div>
		</div>
		<hlm-toaster />
	`,
	standalone: true,
})
export default class LobbyPageComponent {
	private readonly _navigator = inject(NAVIGATOR_TOKEN); // Inject the navigator
	private readonly _gameStore = inject(GameStore);
	protected readonly toast = toast;
	protected readonly connectedPlayers = this._gameStore.players;
	protected readonly isClipboardAvailable = computed(() => !!this._navigator?.clipboard);

	protected copyLink(): void {
		const currentUrl = window.location.href; // Get the current URL
		if (this._navigator.clipboard) {
			// Clipboard API is supported
			this._navigator.clipboard
				.writeText(currentUrl)
				.then(() => {
					this.toast('URL copied to clipboard!');
				})
				.catch(() => {
					this.toast("Sorry, we weren't able to add the link to your clipboard!");
				});
		} else {
			// Fallback for browsers that do not support the Clipboard API
			console.warn('Clipboard API not available');
		}
	}
}
