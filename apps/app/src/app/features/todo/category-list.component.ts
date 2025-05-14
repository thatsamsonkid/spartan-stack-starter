import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Category } from '../../core/types/todo.types';
import { TodoStore } from '../../store/todo.store';

@Component({
	selector: 'app-category-list',

	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatProgressBarModule,
	],
	template: `
		<div class="container mx-auto p-4">
			<div class="mb-6 flex items-center justify-between">
				<h1 class="text-2xl font-bold">Categories</h1>
				<button mat-raised-button color="primary" (click)="openCategoryDialog()">
					<mat-icon>add</mat-icon>
					New Category
				</button>
			</div>

			@if (todoStore.loading()) {
				<mat-progress-bar mode="indeterminate"></mat-progress-bar>
			}

			@if (todoStore.error()) {
				<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
					{{ todoStore.error() }}
				</div>
			}

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				@for (category of todoStore.categories(); track category.id) {
					<mat-card>
						<mat-card-header>
							<mat-card-title class="flex items-center gap-2">
								<span class="inline-block h-4 w-4 rounded-full" [style.background-color]="category.color"></span>
								{{ category.name }}
							</mat-card-title>
						</mat-card-header>

						<mat-card-actions align="end">
							<button mat-icon-button (click)="openCategoryDialog(category)">
								<mat-icon>edit</mat-icon>
							</button>
							<button mat-icon-button color="warn" (click)="onDelete(category)">
								<mat-icon>delete</mat-icon>
							</button>
						</mat-card-actions>
					</mat-card>
				}
			</div>
		</div>
	`,
})
export class CategoryListComponent implements OnInit {
	private fb = inject(FormBuilder);
	private dialog = inject(MatDialog);
	todoStore = inject(TodoStore);

	ngOnInit() {
		this.todoStore.loadCategories();
	}

	openCategoryDialog(category?: Category) {
		const dialogRef = this.dialog.open(CategoryDialogComponent, {
			width: '400px',
			data: category,
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				if (category) {
					this.todoStore.updateCategory({ id: category.id, ...result });
				} else {
					this.todoStore.createCategory(result);
				}
			}
		});
	}

	onDelete(category: Category) {
		if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
			this.todoStore.deleteCategory(category.id);
		}
	}
}

@Component({
	selector: 'app-category-dialog',

	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
	],
	template: `
		<h2 mat-dialog-title>
			{{ data ? 'Edit Category' : 'New Category' }}
		</h2>

		<form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
			<mat-dialog-content>
				<mat-form-field class="w-full">
					<mat-label>Name</mat-label>
					<input matInput formControlName="name" placeholder="Enter category name" required />
					@if (categoryForm.get('name')?.hasError('required') && categoryForm.get('name')?.touched) {
						<mat-error>Name is required</mat-error>
					}
				</mat-form-field>

				<mat-form-field class="w-full">
					<mat-label>Color</mat-label>
					<input matInput formControlName="color" type="color" required />
					@if (categoryForm.get('color')?.hasError('required') && categoryForm.get('color')?.touched) {
						<mat-error>Color is required</mat-error>
					}
				</mat-form-field>
			</mat-dialog-content>

			<mat-dialog-actions align="end">
				<button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
				<button mat-raised-button color="primary" type="submit" [disabled]="categoryForm.invalid">
					{{ data ? 'Update' : 'Create' }}
				</button>
			</mat-dialog-actions>
		</form>
	`,
})
export class CategoryDialogComponent {
	private fb = inject(FormBuilder);
	dialogRef = inject(MatDialog);

	categoryForm: FormGroup;
	data: Category | undefined;

	constructor() {
		this.categoryForm = this.fb.group({
			name: ['', Validators.required],
			color: ['#000000', Validators.required],
		});
	}

	onSubmit() {
		if (this.categoryForm.valid) {
			this.dialogRef.close(this.categoryForm.value);
		}
	}
}
