import { Injectable, inject } from '@angular/core';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_PROJECT, SUPABASE_PUB_KEY } from './supabase-tokens';

@Injectable({
	providedIn: 'root',
})
export class SupabaseClientService {
	private _SUPABASE_PROJECT = inject(SUPABASE_PROJECT);
	private _SUPABASE_PUB_KEY = inject(SUPABASE_PUB_KEY);

	public readonly _supabase!: SupabaseClient;

	constructor() {
		this._supabase = createClient(
			`https://${this._SUPABASE_PROJECT}.supabase.co`,
			// this._SUPABASE_PUB_KEY
			// `http://localhost:54321`,
			this._SUPABASE_PUB_KEY,
		);
	}

	get client() {
		return this._supabase;
	}
}
