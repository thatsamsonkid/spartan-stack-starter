import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthStore } from '../../store/auth.store';

/**
 * On client we will only call getSession, which only checks browser cookie for auth
 * getSession also auto refresh token if needed, so no need for us to do especially since we run this on any page change
 * On Serverside, for any api call we will call getUser to verify the user session is actually valid
 *
 */
export const anonAuthGuard: (
	route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot,
) => Promise<boolean | null> = async () => {
	const store = inject(AuthStore);
	const { data } = await store.getSession();
	if (data?.session) {
		return true;
	}
	const { data: newAnonSess } = await store.signInAnonymously();
	return !!newAnonSess;
};
