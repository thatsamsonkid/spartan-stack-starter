import { Component } from '@angular/core';
import { TodoListComponent } from '../../features/todo/todo-list.component';

@Component({
	selector: 'app-todos-page',
	imports: [TodoListComponent],
	template: `
		<app-todo-list />
	`,
})
export default class TodosPage {}
