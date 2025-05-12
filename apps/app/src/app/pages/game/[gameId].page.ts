import type { RouteMeta } from '@analogjs/router';
import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs';
import { GameboardCellComponent } from '../../components/gameboard-cell.component';
import { anonAuthGuard } from '../../core/guards/anon-auth.guard';
import { gameInProgressGuard } from '../../core/guards/game.guard';

import { BrnDialogModule } from '@spartan-ng/brain/dialog';

import { HlmDialogModule } from '@spartan-ng/ui-dialog-helm';
import { GameStore } from '../../store/game/games.store';
import { ChallengersComponent } from './components/challengers.component';
import { GameTimerComponent } from './components/game-timer.component';

export const routeMeta: RouteMeta = {
	title: 'About Analog',
	canActivate: [anonAuthGuard, gameInProgressGuard],
};

@Component({
	selector: 'app-game-id-page',
	imports: [
		HlmDialogModule,
		BrnDialogModule,
		GameboardCellComponent,
		JsonPipe,
		GameTimerComponent,
		ChallengersComponent,
	],
	template: `
		<p>{{ gameStatus() }}</p>
		<!-- <p>{{ id() }}</p> -->
		<p>{{ isPlayerTurn() }}</p>
		<!-- <p>{{ playerSymbol() }}</p>
		@if (isSpectator()) {
			<p>Spectating</p>
		} -->

		<!-- {{ game() | json }} -->

		<!-- <app-game-challengers [players]="connectedPlayers()" /> -->

		<app-game-timer />

		<div class="mx-6 grid grid-rows-3 divide-y rounded-sm border">
			@for (row of gameboard(); let rowIndex = $index; track rowIndex) {
				<div class="grid grid-cols-3 divide-x">
					@for (col of row; let colIndex = $index; track 'col' + colIndex) {
						<div class="flex h-60 grow">
							<gb-cell
								[coordinates]="{ x: rowIndex, y: colIndex }"
								[value]="col"
								(buttonClick)="selectCell({ x: rowIndex, y: colIndex })"
							/>
						</div>
					}
				</div>
			}
		</div>
	`,
})
export default class GameIdPageComponent implements OnInit {
	private readonly _route = inject(ActivatedRoute);
	private readonly _gameStore = inject(GameStore);
	// private readonly _gameManager = inject(GameManagerService);

	private readonly _gameId$ = this._route.paramMap.pipe(map((params) => params.get('gameId')));

	protected readonly connectedPlayers = this._gameStore.players;

	// protected game = getState(this._gameStore);

	protected readonly gameboard = this._gameStore.gameboard;
	protected readonly gameStatus = this._gameStore.status;
	protected readonly isPlayerTurn = this._gameStore.isPlayerTurn;
	// protected readonly isSpectator = this._gameManager.isSpectator;
	// protected readonly playerSymbol = this._gameManager.playerSymbol;

	ngOnInit(): void {
		// this._gameStore.connectToGame();
		this._gameId$
			.pipe(take(1))
			.subscribe(async (gameId: string | null) => gameId && (await this._gameStore.connectToGame(gameId)));
	}

	selectCell(coordinates: { x: number; y: number }): void {
		// if (this._gameManager.game().playerTurn && this._gameManager.gameInProgress()) {
		// 	this._gameManager.takeTurn(coordinates);
		// }
	}
}
