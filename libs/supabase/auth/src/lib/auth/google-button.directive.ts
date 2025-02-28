import { Directive, ElementRef, inject, input, signal } from '@angular/core';
import { take } from 'rxjs';
import { GoogleAuthService } from './google-auth.service';

@Directive({
	selector: 'google-signin-button',
	standalone: true,
})
export class GoogleSigninButtonDirective {
	type = input<'icon' | 'standard'>('icon');

	size = input<'small' | 'medium' | 'large'>('medium');

	text = input<'signin_with' | 'signup_with' | 'continue_with'>('signin_with');

	shape = input<'square' | 'circle' | 'pill' | 'rectangular'>('rectangular');

	theme = input<'outline' | 'filled_blue' | 'filled_black'>('outline');

	logo_alignment = input<'left' | 'center'>('left');

	width = signal(0);

	locale = signal('');

	private _el = inject(ElementRef);
	private _googleAuthService = inject(GoogleAuthService);

	constructor() {
		this._googleAuthService.initState.pipe(take(1)).subscribe(() => {
			Promise.resolve(this.width()).then((value) => {
				if (value > 400 || (value < 200 && value !== 0)) {
					Promise.reject(
						'Please note .. max-width 400 , min-width 200 ' +
							'(https://developers.google.com/identity/gsi/web/tools/configurator)',
					);
				} else {
					google.accounts.id.renderButton(this._el.nativeElement, {
						type: this.type(),
						size: this.size(),
						text: this.text(),
						width: this.width(),
						shape: this.shape(),
						theme: this.theme(),
						logo_alignment: this.logo_alignment(),
						locale: this.locale(),
					});
				}
			});
		});
	}
}
