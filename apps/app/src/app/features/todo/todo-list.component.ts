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
	],
	template: `
		<div class="container mx-auto p-4">
			<div class="mb-6 flex items-center justify-between">
				<h1 class="text-2xl font-bold">My Todos</h1>
				<!-- <button spartan-button variant="default" [routerLink]="['/todos/new']">
					<ng-icon hlm name="plus" class="mr-2" />
					New Todo
				</button> -->
			</div>

			@if (todoStore.loading()) {
				<brn-progress hlm class="w-80" aria-labelledby="loading" value="100">
					<brn-progress-indicator hlm />
				</brn-progress>
			}

			@if (todoStore.error()) {
				<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
					{{ todoStore.error() }}
				</div>
			}

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				@for (todo of todoStore.todos(); track todo.id) {
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

						<div class="flex justify-end gap-2 p-4 pt-0">
							<div hlmMenu>
								<button hlmBtn variant="ghost" size="icon">
									<ng-icon hlm name="more-vertical" />
								</button>
								<div hlmMenuContent>
									<button hlmMenuItem [routerLink]="['/todos', todo.id, 'edit']">
										<ng-icon hlm name="edit" class="mr-2" />
										<span>Edit</span>
									</button>
									<button hlmMenuItem (click)="onShare(todo)">
										<ng-icon hlm name="share" class="mr-2" />
										<span>Share</span>
									</button>
									<div hlmSeparator></div>
									<button hlmMenuItem (click)="onDelete(todo)" class="text-red-500">
										<ng-icon hlm name="trash" class="mr-2" />
										<span>Delete</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				}
			</div>
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
