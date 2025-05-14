import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-game-timer',

	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center',
	},
	template: `
		<img src="/assets/clock.svg" alt="" />
		<p>Time Left in turn</p>
	`,
})
export class GameTimerComponent {}
