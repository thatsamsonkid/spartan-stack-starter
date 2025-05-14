import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';
import { HeaderComponent } from '../core/components/header.component';
import { TodoListComponent } from '../features/todo/todo-list.component';

@Component({
	selector: 'spartan-home',
	standalone: true,
	imports: [
		HlmCardModule,
		HlmToasterComponent,
		RouterLink,
		HeaderComponent,
		HlmButtonDirective,
		HlmIconDirective,
		TodoListComponent,
	],
	host: {
		class: 'min-h-screen min-w-screen',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<app-header />
		<main class="container mx-auto p-4">
			<div class="mb-6 flex items-center justify-between">
				<h1 class="text-2xl font-bold">Todo Dashboard</h1>
				<button hlmBtn [routerLink]="['/todos/new']">
					<ng-icon hlm name="plus" class="mr-2" />
					New Todo
				</button>
			</div>

			<app-todo-list />
			<hlm-toaster />
		</main>
	`,
})
export default class HomeComponent {}
