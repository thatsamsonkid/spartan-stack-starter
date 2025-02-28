import { Component, input, output, signal } from '@angular/core';

@Component({
	selector: 'gb-cell',
	standalone: true,
	host: {
		class: 'contents',
	},
	// imports: [JsonPipe],
	template: `
		<!-- Spacer -->
		<button
			class="h-full w-full"
			[disabled]="disabled()"
			(click)="select($event)"
			(mouseenter)="mouseEnter()"
			(mouseleave)="mouseLeave()"
		>
			<!-- {{value() | json}} -->
			@if (value() === 'X') {
				<span>X</span>
			} @else if (value() === 'O') {
				<span>O</span>
			}
			<!-- @else {
		<span>_</span>
	} -->

			<!-- {{ coordinates()?.x }}, {{ coordinates()?.y }} -->
		</button>
	`,
})
export class GameboardCellComponent {
	public coordinates = input<{ x: number; y: number }>();
	public disabled = input();
	public player = input<number>();
	public value = input();

	public readonly buttonClick = output<MouseEvent>();

	public isHovered = signal(false);

	select(event: MouseEvent): void {
		// console.log('making selection');
		this.buttonClick.emit(event);
	}

	mouseEnter(): void {
		this.isHovered.set(true);
		// console.log('Mouse is over the button');
	}

	mouseLeave(): void {
		this.isHovered.set(false);
		// console.log('Mouse has left the button');
	}
}
