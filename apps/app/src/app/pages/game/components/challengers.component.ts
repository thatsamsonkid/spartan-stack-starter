import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { Player } from '../../../store/game/game.types';

@Component({
	selector: 'app-game-challengers',

	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<h2 class="mb-4 text-xl font-bold">Connected Players</h2>
			<ul class="space-y-3">
				@for (player of players(); track player) {
					<li class="flex items-center space-x-4 rounded bg-gray-200 p-2">
						<img src="https://placehold.co/40" alt="User Avatar" class="h-10 w-10 rounded-full" />
						<span class="text-lg">{{ player.id }}</span>
					</li>
				}
			</ul>
		</div>
	`,
})
export class ChallengersComponent {
	public readonly players = input<Player[]>();

	constructor() {
		effect(() => {
			console.log(this.players());
		});
	}
}
