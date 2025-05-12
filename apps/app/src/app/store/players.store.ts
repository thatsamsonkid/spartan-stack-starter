import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { addEntity, removeEntities, updateAllEntities, withEntities } from '@ngrx/signals/entities';

type Player = {
	id: string;
	avatar: string;
};

export const PlayerStore = signalStore(
	withEntities<Player>(),
	withMethods((store) => ({
		addTodo(player: Player): void {
			patchState(store, addEntity(player));
		},
		removeEmptyTodos(): void {
			patchState(
				store,
				removeEntities(({ id }) => !id),
			);
		},
		completeAllTodos(): void {
			patchState(store, updateAllEntities({ avatar: '' }));
		},
	})),
);
