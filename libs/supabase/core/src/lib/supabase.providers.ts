import { SupabaseAuth } from '@agora/supabase/auth';
import { Provider } from '@angular/core';
import { SUPABASE_PROJECT, SUPABASE_PUB_KEY } from './supabase-tokens';
import { SupabaseClientService } from './supabase.service';

export interface SupabaseConfig {
	projectId: string;
	publicKey: string;
}

export function provideSupabaseClient(config: SupabaseConfig): Provider[] {
	return [
		{ provide: SUPABASE_PROJECT, useValue: config.projectId },
		{ provide: SUPABASE_PUB_KEY, useValue: config.publicKey },
		SupabaseClientService,
		SupabaseAuth,
	];
}
