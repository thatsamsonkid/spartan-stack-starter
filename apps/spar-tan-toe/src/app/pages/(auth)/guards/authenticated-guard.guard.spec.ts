import { TestBed } from '@angular/core/testing';
import type { CanActivateFn } from '@angular/router';

import { authenticatedGuardGuard } from './authenticated-guard.guard';

describe('authenticatedGuardGuard', () => {
	const executeGuard: CanActivateFn = (...guardParameters) =>
		TestBed.runInInjectionContext(() => authenticatedGuardGuard(...guardParameters));

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it('should be created', () => {
		expect(executeGuard).toBeTruthy();
	});
});
