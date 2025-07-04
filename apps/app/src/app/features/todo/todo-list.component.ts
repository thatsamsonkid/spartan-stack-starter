import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrnProgressComponent, BrnProgressIndicatorComponent } from '@spartan-ng/brain/progress';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { HlmProgressIndicatorDirective, HlmProgressModule } from '@spartan-ng/ui-progress-helm';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';
import { Todo } from '../../core/types/todo.types';
import { TodoStore } from '../../store/todo.store';

@Component({
	selector: 'app-todo-list',
	imports: [
		CommonModule,
		RouterModule,
		HlmButtonDirective,
		HlmIconDirective,
		HlmCardModule,
		HlmMenuModule,
		HlmSeparatorDirective,
		HlmProgressModule,
		HlmBadgeDirective,
		BrnProgressComponent,
		BrnProgressIndicatorComponent,
		HlmProgressIndicatorDirective,
		HlmSkeletonComponent,
	],
	template: `
		<div class="mx-auto py-4">
			@if (todoStore.loading()) {
				<div class="flex flex-col gap-4">
					<hlm-skeleton class="h-20 w-full" />
					<hlm-skeleton class="h-20 w-full" />
					<hlm-skeleton class="h-20 w-full" />
					<hlm-skeleton class="h-20 w-full" />
					<hlm-skeleton class="h-20 w-full" />
				</div>
			} @else if (todoStore.todos().length > 0) {
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					@for (todo of todoStore.todos(); track todo.id) {
						<a [routerLink]="['/todos', todo.id]">
							<div hlmCard>
								<div class="p-4">
									<div class="mb-2">
										<h3 class="text-lg font-semibold">{{ todo.title }}</h3>
										@if (todo.category) {
											<span
												hlmBadge
												[style.background-color]="todo.category.color + '20'"
												[style.color]="todo.category.color"
											>
												{{ todo.category.name }}
											</span>
										}
									</div>

									@if (todo.description) {
										<p class="mt-2 text-gray-600">{{ todo.description }}</p>
									}

									@if (todo.tags?.length) {
										<div class="mt-4 flex flex-wrap gap-2">
											@for (tag of todo.tags; track tag.id) {
												<span hlmBadge [style.background-color]="tag.color + '20'" [style.color]="tag.color">
													{{ tag.name }}
												</span>
											}
										</div>
									}

									<div class="mt-4 flex items-center gap-4">
										<span
											hlmBadge
											[ngClass]="{
												'bg-yellow-100 text-yellow-800': todo.status === 'pending',
												'bg-blue-100 text-blue-800': todo.status === 'in_progress',
												'bg-green-100 text-green-800': todo.status === 'completed',
											}"
										>
											{{ todo.status | titlecase }}
										</span>
										<span
											hlmBadge
											[ngClass]="{
												'bg-gray-100 text-gray-800': todo.priority === 'low',
												'bg-orange-100 text-orange-800': todo.priority === 'medium',
												'bg-red-100 text-red-800': todo.priority === 'high',
											}"
										>
											{{ todo.priority | titlecase }}
										</span>
									</div>
								</div>
							</div>
						</a>
					}
				</div>
			} @else if (todoStore.error()) {
				<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
					{{ todoStore.error() }}
				</div>
			} @else {
				<section class="flex h-20 w-full flex-col items-center justify-center" hlmCard>
					<h3 class="text-lg font-semibold">No todos found</h3>
				</section>
			}
		</div>
	`,
})
export class TodoListComponent implements OnInit {
	protected readonly todoStore = inject(TodoStore);

	ngOnInit() {
		this.todoStore.loadTodos();
	}

	onDelete(todo: Todo) {
		if (confirm(`Are you sure you want to delete "${todo.title}"?`)) {
			this.todoStore.deleteTodo(todo.id);
		}
	}

	onShare(todo: Todo) {
		// TODO: Implement share functionality
		console.log('Share todo:', todo);
	}
}
