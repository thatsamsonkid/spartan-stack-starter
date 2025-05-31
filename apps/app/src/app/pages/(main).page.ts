import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';
import { HeaderComponent } from '../core/components/header.component';
import { TodoListComponent } from '../features/todo/todo-list.component';

@Component({
	selector: 'spartan-home',
	host: {
		class: 'min-h-screen min-w-screen',
	},
	imports: [
		HlmCardModule,
		HlmToasterComponent,
		RouterLink,
		HeaderComponent,
		HlmButtonDirective,
		NgIcon,
		HlmIconDirective,
		TodoListComponent,
		RouterOutlet,
	],
	providers: [provideIcons({ lucidePlus })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<app-header />
		<main class="container mx-auto max-w-screen-xl p-4">
			<router-outlet />
			<hlm-toaster />
		</main>
	`,
})
export default class MainComponent {}
