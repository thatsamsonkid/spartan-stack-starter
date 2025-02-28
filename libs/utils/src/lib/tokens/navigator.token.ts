// src/app/services/navigator.token.ts
import { InjectionToken } from '@angular/core';

export const NAVIGATOR_TOKEN = new InjectionToken<Navigator>('NAVIGATOR_TOKEN', {
	providedIn: 'root',
	factory: () => window.navigator,
});
