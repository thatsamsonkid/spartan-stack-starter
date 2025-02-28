import { Result, tryCatchObservable } from '@/utils';
import { SupabaseClientService } from '@agora/supabase/core';
import { Injectable, inject, signal, type OnDestroy } from '@angular/core';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { catchError, firstValueFrom, map, of, tap, type Observable } from 'rxjs';
import { injectTrpcClient } from '../../../trpc-client';
import { GAME_STORE_TOKEN } from '../../store/game/game.token';
import { Move } from '../../store/game/game.types';
import type { GAME } from '../types/game.types';

@Injectable({
	providedIn: 'root',
})
export class GameManagerService implements OnDestroy {
	private readonly _supabase = inject(SupabaseClientService);
	private readonly _trpc = injectTrpcClient();
	private readonly _gameStore = inject(GAME_STORE_TOKEN);

	public gameChannel!: RealtimeChannel;
	public gameMovesChannel!: RealtimeChannel;

	private readonly _initialGameSetup = signal(false);
	public moves = signal([]);

	public isSpectator = signal(false);

	public startNewGame(): Promise<{ data: GAME; error: any }> {
		return firstValueFrom(
			this._trpc.game.create.mutate().pipe(tap(({ data: game }) => this.createSupabaseChannel(game?.id))),
		);
	}

	public async joinGameAsPlayer(gameId: string): Promise<void> {
		const { data: game, error } = await firstValueFrom(this.joinGame(gameId));
		if (error && !game) {
			throw Error('Unable to join game');
		}
	}

	/**
	 * description Supabase Channel Setup
	 * @param gameId
	 */
	public createSupabaseChannel(gameId: string): void {
		console.log('createSupabaseChannel + game');
		try {
			this.gameChannel = this._supabase.client
				.channel(gameId)
				.on(
					'postgres_changes',
					{
						event: 'UPDATE',
						schema: 'public',
						table: 'game',
						filter: `id=eq.${gameId}`,
					},
					(payload) => {
						console.log('GS SUB:', payload);
						// if (!this._initialGameSetup()) {
						// 	this._initialGameSetup.set(true);
						// 	const isPlayerOne = payload.new.player_1 === this._authService.userId();
						// 	this.game.update((state) => ({
						// 		...state,
						// 		playerTurn: isPlayerOne,
						// 		playerOneSymbol: 'X',
						// 		playerTwoSymbol: 'O',
						// 		status: payload.new.game_status,
						// 	}));
						// } else {
						// 	this.game.update((state) => ({
						// 		...state,
						// 		status: payload.new.game_status,
						// 	}));
						// }
					},
				)
				.subscribe();

			this.gameMovesChannel = this._supabase.client
				.channel(`${gameId}_moves`)
				.on(
					'postgres_changes',
					{
						event: 'INSERT',
						schema: 'public',
						table: 'moves',
						filter: `game_id=eq.${gameId}`,
					},
					(payload) => {
						console.log('Moves Table Change', payload);
						// if (this._authService.user()?.id === payload.new.player_id) {
						// 	this.game.update((state) => ({ ...state, playerTurn: false }));
						// } else {
						// 	this.game.update((state) => ({ ...state, playerTurn: true }));
						// }

						// if (!this.game().gameboard[payload.new.row][payload.new.column]) {
						// 	const isPlayerMove = payload.new.player_id === this._authService.userId();
						// 	const symbol = isPlayerMove ? this.playerSymbol() : this.oppSymbol();
						// 	this.updateGameboard(payload.new.row, payload.new.column, symbol);
						// }

						// const winner = this.checkForWinner(this.game().gameboard);
						// if (winner && winner === this._authService.userId()) {
						// 	// Make a TRPC call to update the game with the winner's ID
						// 	this._trpc.game.updateWinner.mutate({ gameId, winnerId: winner });
						// }
					},
				)
				.subscribe();
		} catch (e) {
			console.error(e);
		}
	}

	public joinGame(gameId: string): Observable<{ data: GAME | null; error: any | null }> {
		return this._trpc.game.join.mutate({ gameId: gameId }).pipe(
			map((response) => {
				if (!response?.[0]?.id) {
					throw new Error('Game not found');
				}
				return { data: response[0], error: null };
			}),
			catchError(() => of({ data: null, error: 'Game not found' })),
		);
	}

	public async findGame(gameId: string): Promise<Result<GAME, Error>> {
		return await tryCatchObservable<GAME, Error>(this._trpc.game.findGame.query({ id: gameId }));
	}

	public loadGameMoves(gameId: string): Promise<any> {
		return tryCatchObservable(this._trpc.moves.select.query({ id: gameId }));
	}

	public async updateMovesTable(
		{ id: gameId, userId: playerId }: { id: string; userId: string },
		move: Move,
	): Promise<any> {
		return tryCatchObservable(
			this._trpc.moves.create.mutate({
				gameId,
				playerId,
				column: move.column,
				row: move.row,
				symbol: 0,
			}),
		);
	}

	ngOnDestroy(): void {
		if (this.gameChannel) {
			this.gameChannel.unsubscribe();
		}

		if (this.gameMovesChannel) {
			this.gameMovesChannel.unsubscribe();
		}
	}
}
