import { provideFileRouter, withDebugRoutes } from '@analogjs/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideExperimentalZonelessChangeDetection, type ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';

import { ScriptLoaderService } from '@agora/script-loader';
import { GOOGLE_CLIENT_ID, GOOGLE_INIT_OPTIONS, GoogleAuthService } from '@agora/supabase/auth';
import { provideSupabaseClient } from '@agora/supabase/core';
import { withViewTransitions } from '@angular/router';
import { provideTrpcClient } from '../trpc-client';
import { provideGameStoreToken } from './store/game/game.token';

export const appConfig: ApplicationConfig = {
	providers: [
		provideFileRouter(withDebugRoutes(), withViewTransitions()),
		provideClientHydration(),
		provideHttpClient(withFetch()),
		provideTrpcClient(),
		provideExperimentalZonelessChangeDetection(),
		// Custom providers
		ScriptLoaderService,
		provideSupabaseClient({
			projectId: import.meta.env.VITE_DATABASE_REF,
			publicKey: import.meta.env.VITE_DATABASE_PUB_KEY,
		}),
		GoogleAuthService,
		{
			provide: GOOGLE_CLIENT_ID,
			useValue: import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID,
		},
		{ provide: GOOGLE_INIT_OPTIONS, useValue: {} },
		provideGameStoreToken(),
	],
};
