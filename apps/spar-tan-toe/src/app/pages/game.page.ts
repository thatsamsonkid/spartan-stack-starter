import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../core/components/header.component';

@Component({
	selector: 'app-game-page',
	imports: [RouterOutlet, HeaderComponent],
	template: ' <app-header /><router-outlet />',
	standalone: true,
})
export default class GamePageComponent {}
