import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCalendarComponent } from '@spartan-ng/ui-calendar-helm';
import { HlmCommandDirective } from '@spartan-ng/ui-command-helm';
import { HlmFormFieldDirective } from '@spartan-ng/ui-formfield-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmProgressDirective } from '@spartan-ng/ui-progress-helm';
import { HlmSelectDirective } from '@spartan-ng/ui-select-helm';
import { TodoPriority, TodoStatus } from '../../../core/types/todo.types';
import { TodoStore } from '../../../store/todo.store';

@Component({
	selector: 'app-todo-form',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		HlmButtonDirective,
		HlmIconDirective,
		HlmProgressDirective,
		HlmFormFieldDirective,
		HlmInputDirective,
		HlmSelectDirective,
		HlmCalendarComponent,
		HlmBadgeDirective,
		HlmCommandDirective,
	],
	template: `
		<div class="container mx-auto max-w-2xl p-4">
			<div class="mb-6 flex items-center gap-4">
				<button hlmBtn variant="ghost" size="icon" (click)="router.navigate(['/todos'])">
					<ng-icon hlm name="arrow-left" />
				</button>
				<h1 class="text-2xl font-bold">
					{{ isEditMode ? 'Edit Todo' : 'New Todo' }}
				</h1>
			</div>

			@if (todoStore.loading()) {
				<div hlmProgress value="100" />
			}

			@if (todoStore.error()) {
				<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
					{{ todoStore.error() }}
				</div>
			}

			<form [formGroup]="todoForm" (ngSubmit)="onSubmit()" class="space-y-4">
				<div hlmFormField>
					<label hlmLabel>Title</label>
					<input hlmInput formControlName="title" placeholder="Enter todo title" required />
					@if (todoForm.get('title')?.hasError('required') && todoForm.get('title')?.touched) {
						<span hlmError>Title is required</span>
					}
				</div>

				<div hlmFormField>
					<label hlmLabel>Description</label>
					<textarea hlmInput formControlName="description" placeholder="Enter todo description" rows="3"></textarea>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div hlmFormField>
						<label hlmLabel>Status</label>
						<select hlmSelect formControlName="status">
							@for (status of statuses; track status) {
								<option [value]="status">
									{{ status | titlecase }}
								</option>
							}
						</select>
					</div>

					<div hlmFormField>
						<label hlmLabel>Priority</label>
						<select hlmSelect formControlName="priority">
							@for (priority of priorities; track priority) {
								<option [value]="priority">
									{{ priority | titlecase }}
								</option>
							}
						</select>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div hlmFormField>
						<label hlmLabel>Category</label>
						<select hlmSelect formControlName="category_id">
							<option [value]="null">None</option>
							@for (category of todoStore.categories(); track category.id) {
								<option [value]="category.id">
									<span class="mr-2 inline-block h-3 w-3 rounded-full" [style.background-color]="category.color"></span>
									{{ category.name }}
								</option>
							}
						</select>
					</div>

					<div hlmFormField>
						<label hlmLabel>Due Date</label>
						<hlm-calendar formControlName="due_date" />
					</div>
				</div>

				<div hlmFormField>
					<label hlmLabel>Tags</label>
					<div class="flex flex-wrap gap-2">
						@for (tag of selectedTags; track tag.id) {
							<span hlmBadge [style.background-color]="tag.color + '20'" [style.color]="tag.color">
								{{ tag.name }}
								<button hlmBtn variant="ghost" size="icon" (click)="removeTag(tag)">
									<ng-icon hlm name="x" class="h-3 w-3" />
								</button>
							</span>
						}
					</div>
					<div hlmCommand>
						<input
							hlmInput
							placeholder="Add tags..."
							[hlmCommandInput]
							[matChipInputSeparatorKeyCodes]="separatorKeysCodes"
							(matChipInputTokenEnd)="addTag($event)"
						/>
						<div hlmCommandList>
							@for (tag of filteredTags; track tag.id) {
								<button hlmCommandItem (click)="selectedTag(tag)">
									<span class="mr-2 inline-block h-3 w-3 rounded-full" [style.background-color]="tag.color"></span>
									{{ tag.name }}
								</button>
							}
						</div>
					</div>
				</div>

				<div class="flex justify-end gap-4">
					<button hlmBtn variant="outline" type="button" (click)="router.navigate(['/todos'])">Cancel</button>
					<button hlmBtn variant="default" type="submit" [disabled]="todoForm.invalid || todoStore.loading()">
						{{ isEditMode ? 'Update' : 'Create' }}
					</button>
				</div>
			</form>
		</div>
	`,
})
export class TodoFormComponent implements OnInit {
	private readonly _fb = inject(FormBuilder);
	private readonly _route = inject(ActivatedRoute);
	protected readonly router = inject(Router);
	protected readonly todoStore = inject(TodoStore);

	protected todoForm: FormGroup;
	protected isEditMode = false;
	protected readonly statuses: TodoStatus[] = ['pending', 'in_progress', 'completed'];
	protected readonly priorities: TodoPriority[] = ['low', 'medium', 'high'];
	protected selectedTags: any[] = [];
	protected filteredTags: any[] = [];
	protected readonly separatorKeysCodes: number[] = [13, 188]; // Enter and comma

	constructor() {
		this.todoForm = this._fb.group({
			title: ['', Validators.required],
			description: [''],
			status: ['pending'],
			priority: ['medium'],
			category_id: [null],
			due_date: [null],
		});
	}

	ngOnInit() {
		this.todoStore.loadCategories();
		this.todoStore.loadTags();

		const todoId = this._route.snapshot.paramMap.get('id');
		if (todoId) {
			this.isEditMode = true;
			// TODO: Load todo data and populate form
		}
	}

	onSubmit() {
		if (this.todoForm.valid) {
			const formValue = this.todoForm.value;
			const todoData = {
				...formValue,
				tag_ids: this.selectedTags.map((tag) => tag.id),
			};

			if (this.isEditMode) {
				const todoId = this._route.snapshot.paramMap.get('id');
				this.todoStore.updateTodo({ id: todoId!, ...todoData });
			} else {
				this.todoStore.createTodo(todoData);
			}
		}
	}

	addTag(event: any) {
		const value = (event.value || '').trim();
		if (value) {
			// TODO: Create new tag
			console.log('Create new tag:', value);
		}
		event.chipInput!.clear();
	}

	removeTag(tag: any) {
		const index = this.selectedTags.indexOf(tag);
		if (index >= 0) {
			this.selectedTags.splice(index, 1);
		}
	}

	selectedTag(tag: any) {
		this.selectedTags.push(tag);
	}
}
