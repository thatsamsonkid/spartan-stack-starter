import { SupabaseAuth } from '@agora/supabase/auth';
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const unauthenticatedGuard: CanActivateFn = () => {
	const authService = inject(SupabaseAuth);
	const router = inject(Router);

	if (!authService.isAuthenticated()) {
		return true;
	}
	router.navigate(['/']); // Redirect to login or fallback route
	return false;
};
