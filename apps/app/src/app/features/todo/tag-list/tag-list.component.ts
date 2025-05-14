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
import { Tag } from '../../../core/types/todo.types';
import { TodoStore } from '../../store/todo.store';

@Component({
	selector: 'app-tag-list',

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
				<h1 class="text-2xl font-bold">Tags</h1>
				<button mat-raised-button color="primary" (click)="openTagDialog()">
					<mat-icon>add</mat-icon>
					New Tag
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
				@for (tag of todoStore.tags(); track tag.id) {
					<mat-card>
						<mat-card-header>
							<mat-card-title class="flex items-center gap-2">
								<span class="inline-block h-4 w-4 rounded-full" [style.background-color]="tag.color"></span>
								{{ tag.name }}
							</mat-card-title>
						</mat-card-header>

						<mat-card-actions align="end">
							<button mat-icon-button (click)="openTagDialog(tag)">
								<mat-icon>edit</mat-icon>
							</button>
							<button mat-icon-button color="warn" (click)="onDelete(tag)">
								<mat-icon>delete</mat-icon>
							</button>
						</mat-card-actions>
					</mat-card>
				}
			</div>
		</div>
	`,
})
export class TagListComponent implements OnInit {
	private fb = inject(FormBuilder);
	private dialog = inject(MatDialog);
	todoStore = inject(TodoStore);

	ngOnInit() {
		this.todoStore.loadTags();
	}

	openTagDialog(tag?: Tag) {
		const dialogRef = this.dialog.open(TagDialogComponent, {
			width: '400px',
			data: tag,
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				if (tag) {
					this.todoStore.updateTag({ id: tag.id, ...result });
				} else {
					this.todoStore.createTag(result);
				}
			}
		});
	}

	onDelete(tag: Tag) {
		if (confirm(`Are you sure you want to delete "${tag.name}"?`)) {
			this.todoStore.deleteTag(tag.id);
		}
	}
}

@Component({
	selector: 'app-tag-dialog',

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
			{{ data ? 'Edit Tag' : 'New Tag' }}
		</h2>

		<form [formGroup]="tagForm" (ngSubmit)="onSubmit()">
			<mat-dialog-content>
				<mat-form-field class="w-full">
					<mat-label>Name</mat-label>
					<input matInput formControlName="name" placeholder="Enter tag name" required />
					@if (tagForm.get('name')?.hasError('required') && tagForm.get('name')?.touched) {
						<mat-error>Name is required</mat-error>
					}
				</mat-form-field>

				<mat-form-field class="w-full">
					<mat-label>Color</mat-label>
					<input matInput formControlName="color" type="color" required />
					@if (tagForm.get('color')?.hasError('required') && tagForm.get('color')?.touched) {
						<mat-error>Color is required</mat-error>
					}
				</mat-form-field>
			</mat-dialog-content>

			<mat-dialog-actions align="end">
				<button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
				<button mat-raised-button color="primary" type="submit" [disabled]="tagForm.invalid">
					{{ data ? 'Update' : 'Create' }}
				</button>
			</mat-dialog-actions>
		</form>
	`,
})
export class TagDialogComponent {
	private fb = inject(FormBuilder);
	dialogRef = inject(MatDialog);

	tagForm: FormGroup;
	data: Tag | undefined;

	constructor() {
		this.tagForm = this.fb.group({
			name: ['', Validators.required],
			color: ['#000000', Validators.required],
		});
	}

	onSubmit() {
		if (this.tagForm.valid) {
			this.dialogRef.close(this.tagForm.value);
		}
	}
}
