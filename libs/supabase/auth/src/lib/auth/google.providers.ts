import { Provider } from '@angular/core';
import type { GoogleInitOptions } from './google-auth.service';
import { GoogleAuthService } from './google-auth.service';
import { GOOGLE_CLIENT_ID, GOOGLE_INIT_OPTIONS } from './google-token';

export interface GoogleAuthConfig {
	clientId: string;
	initOptions?: GoogleInitOptions;
}

export function provideGoogleAuth(config: GoogleAuthConfig): Provider[] {
	return [
		{ provide: GOOGLE_CLIENT_ID, useValue: config.clientId },
		{ provide: GOOGLE_INIT_OPTIONS, useValue: config.initOptions || {} },
		GoogleAuthService,
	];
}
