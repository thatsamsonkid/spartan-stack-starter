import { SupabaseAuth } from '@agora/supabase/auth';
import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';

export const authenticatedGuardGuard: CanActivateFn = (_route, _state) => {
	const authService = inject(SupabaseAuth);
	return !!authService.isAuthenticated();
};
