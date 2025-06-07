import { RouteMeta } from '@analogjs/router';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TrpcClient } from '../../../../trpc-client';
import { TodoDetailComponent } from '../../../features/todo/todo-detail.component';
import { Todo } from '../../../types/todo.types';

export const routeMeta: RouteMeta = {
	title: 'Todo Details',
};

@Component({
	selector: 'app-todo-detail-page',
	standalone: true,
	imports: [TodoDetailComponent],
	template: `
		<div class="container mx-auto p-4">
			@if (loading()) {
				<div class="text-center">Loading...</div>
			} @else if (error()) {
				<div class="text-center text-red-500">{{ error() }}</div>
			} @else {
				<app-todo-detail [todo]="todo()" />
			}
		</div>
	`,
})
export default class TodoDetailPageComponent implements OnInit {
	private readonly _trpc = inject(TrpcClient);
	private readonly _route = inject(ActivatedRoute);

	protected todo = signal<Todo | null>(null);
	protected loading = signal(true);
	protected error = signal<string | null>(null);

	async ngOnInit() {
		const todoId = this._route.snapshot.paramMap.get('id');
		if (!todoId) {
			this.error.set('Todo ID not found');
			this.loading.set(false);
			return;
		}

		try {
			const result = await firstValueFrom(this._trpc.todo.get.query({ id: todoId }));
			if (result.error) throw new Error(result.error);
			this.todo.set(result.data?.[0] ?? null);
		} catch (err) {
			this.error.set(err instanceof Error ? err.message : 'Failed to load todo');
		} finally {
			this.loading.set(false);
		}
	}
}
