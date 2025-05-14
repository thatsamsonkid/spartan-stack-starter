import { Injectable, inject, signal } from '@angular/core';
import { TrpcClient } from '../../trpc-client';
import { Todo } from '../core/types/todo.types';

@Injectable({
	providedIn: 'root',
})
export class TodoStore {
	private readonly _trpc = inject(TrpcClient);

	// State
	public readonly todos = signal<Todo[]>([]);
	public readonly loading = signal(false);
	public readonly error = signal<string | null>(null);

	// Load todos
	async loadTodos() {
		this.loading.set(true);
		this.error.set(null);

		try {
			const result = await this._trpc.todo.list.query();
			this.todos.set(result as Todo[]);
		} catch (err) {
			this.error.set(err instanceof Error ? err.message : 'Failed to load todos');
		} finally {
			this.loading.set(false);
		}
	}

	// Create todo
	async createTodo(todo: Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
		this.loading.set(true);
		this.error.set(null);

		try {
			const result = await this._trpc.todo.create.mutate(todo);
			this.todos.update((todos) => [...todos, result as Todo]);
			return result;
		} catch (err) {
			this.error.set(err instanceof Error ? err.message : 'Failed to create todo');
			throw err;
		} finally {
			this.loading.set(false);
		}
	}

	// Update todo
	async updateTodo(todo: Partial<Todo> & { id: string }) {
		this.loading.set(true);
		this.error.set(null);

		try {
			const result = await this._trpc.todo.update.mutate(todo);
			this.todos.update((todos) => todos.map((t) => (t.id === todo.id ? { ...t, ...(result as Todo) } : t)));
			return result;
		} catch (err) {
			this.error.set(err instanceof Error ? err.message : 'Failed to update todo');
			throw err;
		} finally {
			this.loading.set(false);
		}
	}

	// Delete todo
	async deleteTodo(id: string) {
		this.loading.set(true);
		this.error.set(null);

		try {
			await this._trpc.todo.delete.mutate({ id });
			this.todos.update((todos) => todos.filter((t) => t.id !== id));
		} catch (err) {
			this.error.set(err instanceof Error ? err.message : 'Failed to delete todo');
			throw err;
		} finally {
			this.loading.set(false);
		}
	}

	// Share todo
	async shareTodo(todoId: string, sharedWithUserId: string, canEdit = false) {
		this.loading.set(true);
		this.error.set(null);

		try {
			const result = await this._trpc.todo.share.mutate({
				todo_id: todoId,
				shared_with_user_id: sharedWithUserId,
				can_edit: canEdit,
			});
			return result;
		} catch (err) {
			this.error.set(err instanceof Error ? err.message : 'Failed to share todo');
			throw err;
		} finally {
			this.loading.set(false);
		}
	}
}
