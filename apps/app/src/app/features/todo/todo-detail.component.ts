import { TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Todo } from '../../types/todo.types';

@Component({
	selector: 'app-todo-detail',
	standalone: true,
	imports: [TitleCasePipe],
	template: `
		<div class="container mx-auto max-w-2xl p-4">
			@if (todo()) {
				<div class="rounded-lg border p-6 shadow-sm">
					<h1 class="mb-4 text-2xl font-bold">{{ todo()!.title }}</h1>

					<div class="mb-4">
						<p class="text-gray-600">{{ todo()!.description || 'No description' }}</p>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<span class="font-semibold">Status:</span>
							<span class="ml-2">{{ todo()!.status | titlecase }}</span>
						</div>
						<div>
							<span class="font-semibold">Priority:</span>
							<span class="ml-2">{{ todo()!.priority | titlecase }}</span>
						</div>
						<div>
							<span class="font-semibold">Due Date:</span>
							<span class="ml-2">{{ todo()!.due_date || 'No due date' }}</span>
						</div>
						<div>
							<span class="font-semibold">Category:</span>
							<span class="ml-2">{{ todo()!.category_id || 'No category' }}</span>
						</div>
					</div>
				</div>
			} @else {
				<div class="text-center text-gray-500">Loading todo details...</div>
			}
		</div>
	`,
})
export class TodoDetailComponent {
	public todo = input<Todo | null>(null);
}
