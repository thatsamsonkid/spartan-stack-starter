import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-todos-page',
	imports: [RouterOutlet],
	template: `
		<router-outlet />
	`,
})
export default class TodosPageComponent {}
