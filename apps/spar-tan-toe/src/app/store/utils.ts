import { effect } from '@angular/core';
import { getState, patchState, signalStoreFeature, withHooks } from '@ngrx/signals';

export function isNonNegativeNumber(value: unknown) {
	return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

export function withLogger(name: string) {
	return signalStoreFeature(
		withHooks({
			onInit(store) {
				effect(() => {
					const state = getState(store);
					console.log(`${name} state changed`, state);
				});
			},
		}),
	);
}

export function withPersistentStorage(key: string) {
	return signalStoreFeature(
		withHooks((store) => ({
			onInit() {
				const persistedState = localStorage.getItem(key);
				if (persistedState) {
					patchState(store, { ...JSON.parse(persistedState) });
				}
				effect(() => {
					const state = getState(store);
					localStorage.setItem(key, JSON.stringify(state));
				});
			},
		})),
	);
}
