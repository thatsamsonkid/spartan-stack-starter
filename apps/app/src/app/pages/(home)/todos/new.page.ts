import { Component } from '@angular/core';
import { TodoFormComponent } from '../../../features/todo/todo-form.component';

@Component({
	selector: 'app-new-todo-page',

	imports: [TodoFormComponent],
	template: `
		<app-todo-form />
	`,
})
export default class NewTodoPage {}
