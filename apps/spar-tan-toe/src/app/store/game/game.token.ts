import { InjectionToken } from '@angular/core';
import { GameStore } from './games.store';

export const GAME_STORE_TOKEN = new InjectionToken<typeof GameStore>('GAME_STORE_TOKEN');

export const provideGameStoreToken = () => ({ provide: GAME_STORE_TOKEN, useClass: GameStore });
