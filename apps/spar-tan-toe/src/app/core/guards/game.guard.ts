import { inject } from '@angular/core';
import { Router, type ActivatedRouteSnapshot, type RouterStateSnapshot } from '@angular/router';
import { GameStore } from '../../store/game/games.store';

export const gameInProgressGuard: (
	route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot,
) => Promise<boolean | null> = async () => {
	const router = inject(Router);
	const gameStore = inject(GameStore);
	if (gameStore.status() === 'queued') {
		router.navigate([`/game/${gameStore.id()}/lobby`]);
	}
	return true;
};
