import { SupabaseClientService } from '@agora/supabase/core';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
	patchState,
	signalStore,
	signalStoreFeature,
	withComputed,
	withMethods,
	withProps,
	withState,
} from '@ngrx/signals';
import { GameManagerService } from '../../core/services/game-manager.service';
import { AuthStore } from '../auth.store';
import { isNonNegativeNumber, withLogger, withPersistentStorage } from '../utils';
import { GameState, Move } from './game.types';
import { checkForWinner, loadGameBoard, update2DArray, updatePlayers } from './game.utils';

const initialState: GameState = {
	loading: false,
	error: null,
	id: '',
	status: 'queued',
	playerTurn: '',
	players: [],
	gameboard: [
		[null, null, null],
		[null, null, null],
		[null, null, null],
	],
	playerOneReady: false, // Initialize player one ready state
	playerTwoReady: false,
};

function withGameStore() {
	return signalStoreFeature(
		withState(initialState),
		withProps(() => ({
			auth: inject(AuthStore),
			supabase: inject(SupabaseClientService),
			gameService: inject(GameManagerService),
			router: inject(Router),
		})),
		withComputed(({ players, status, gameboard, auth, playerTurn }) => ({
			players: computed(() => [...players()]),
			gameInProgress: computed(() => status() === 'in-progress'),
			gameInQueue: computed(() => status() === 'queued'),
			joinable: computed(() => players().filter((player) => player?.id).length < 2),
			playerSymbol: computed(() => players().find((player) => player?.id === auth.userId())?.symbol),
			oppSymbol: computed(() => players().find((player) => player?.id !== auth.userId())?.symbol),
			hasWinner: computed(() => checkForWinner(gameboard())),
			isPlayerTurn: computed(() => auth.userId() === playerTurn()),
		})),
		withMethods(
			({ id, gameService, router, players, gameboard, auth, playerSymbol, oppSymbol, playerTurn, ...store }) => ({
				async createGame(): Promise<void> {
					patchState(store, { loading: true });
					const { data: game, error } = await gameService.startNewGame();

					console.log(game);

					console.log('Players', updatePlayers(players(), [{ id: game?.player_1 || null }, { id: null }], 'id'));

					if (!error) {
						patchState(store, {
							loading: false,
							id: game?.id,
							players: updatePlayers(players(), [{ id: game?.player_1 || null }, { id: game?.player_2 }], 'id'),
							status: game?.game_status ?? 'queued',
							playerOneReady: false, // Initialize player one ready state
							playerTwoReady: false,
						});
						router.navigate(['game', game.id, 'lobby']);
					} else {
						patchState(store, { loading: false, error });
					}
				},
				async connectToGame(gameId: string): Promise<any> {
					console.log('connectin to game...');
					// try {
					if (!gameId) {
						throw Error('Valid game id not found');
					}

					const { data: game, error } = await gameService.findGame(gameId);

					if (error) {
						throw Error('Game not found');
					}

					console.log('GAME FOUND', game);

					// we have a duplicate of this in start new game
					// this.game.update((state) => ({
					// 	...state,
					// 	id: gameId,
					// 	playerOne: game?.player_1 ?? null,
					// 	playerTwo: game?.player_2 ?? null,
					// 	status: game?.game_status ?? state.status,
					// 	playerOneSymbol: 'X',
					// 	playerTwoSymbol: 'O',
					// }));

					// Start listening to changes in game state
					gameService.createSupabaseChannel(gameId);

					if (!store.gameInQueue() && store.joinable()) {
						await gameService.joinGameAsPlayer(gameId);
					} else {
						// this.isSpectator.set(true);
					}

					if (store.gameInProgress()) {
						const { data: moves, error: movesError } = await gameService.loadGameMoves(gameId);

						if (movesError) {
							throw Error('Failed to load moves');
						}

						loadGameBoard(moves, gameboard());
					}

					// Check if game is joinable and attempt to join as player
					// if (!this.isPlayerInGame()) {
					// 	if (game && this.isGameJoinable(game)) {
					// 		// Game is joinable
					// 		await this.joinGameAsPlayer(gameId);
					// 	} else {
					// 		this.isSpectator.set(true);
					// 	}
					// }

					// await firstValueFrom(
					// 	this.loadGameMoves(gameId).pipe(
					// 		tap(({ data: gameMoves }) => {
					// 			console.log(gameMoves?.length);
					// 			console.log('isPlayerOne', this._isPlayerOne());
					// 			if (gameMoves?.length) {
					// 				for (let i = 0; i < gameMoves.length; i++) {
					// 					console.log(gameMoves?.[i]?.column, gameMoves?.[i]?.row);
					// 					if (this.isNonNegativeNumber(gameMoves?.[i]?.column) && this.isNonNegativeNumber(gameMoves?.[i]?.row)) {
					// 						// TODO: Instead of this which is too many for loops
					// 						// for bulk update of the table lets create a map
					// 						// and then loop through the table and check if a value exists in the map apply the value (X/O)
					// 						// const playerSymbol = this.playerSymbol()
					// 						// const oppSymbol = playerSymbol === 'X' ? 'O' : 'X'

					// 						const isPlayerMove = gameMoves[i].player_id === this._authService.userId();
					// 						const symbol = isPlayerMove ? this.playerSymbol() : this.oppSymbol();

					// 						console.log(symbol);
					// 						this.updateGameboard(gameMoves[i].row as number, gameMoves[i].column as number, symbol);
					// 					}
					// 				}

					// 				this.moves.set(gameMoves);

					// 				if (gameMoves[gameMoves.length - 1].player_id !== this._authService.userId()) {
					// 					this.game.update((state) => ({ ...state, playerTurn: true }));
					// 				}

					// 				const winner = this.checkForWinner(this.game().gameboard);
					// 				console.log('Winner', winner);
					// 			} else if (this._isPlayerOne()) {
					// 				this.game.update((state) => ({ ...state, playerTurn: true }));
					// 			}
					// 		}),
					// 	),
					// );
					// } catch (e: unknown) {
					// 	this._router.navigate(['/'], {
					// 		state: { error: `Failed to fetch item, because  ${e}` },
					// 	});
					// }
				},
				updateGameBoard(move: Move): void {
					if (isNonNegativeNumber(move.column) && isNonNegativeNumber(move.row) && move.symbol) {
						const nextGameState = update2DArray(gameboard(), move);
						patchState(store, { gameboard: nextGameState });
					}
				},
				async takeTurn(move: Move): Promise<void> {
					const userId = auth.userId();
					if (userId && playerTurn()) {
						await gameService.updateMovesTable({ id: id(), userId }, move);
					}
				},
			}),
		),
	);
}

export const GameStore = signalStore(
	{ providedIn: 'root' },
	withLogger('game'),
	withPersistentStorage('game'),
	withGameStore(),
);
