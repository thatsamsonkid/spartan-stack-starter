import { Component } from '@angular/core';
import { TodoFormComponent } from '../../../features/todo/todo-form.component';

@Component({
	selector: 'app-edit-todo-page',
	standalone: true,
	imports: [TodoFormComponent],
	template: `
		<app-todo-form />
	`,
})
export default class EditTodoPageComponent {}
