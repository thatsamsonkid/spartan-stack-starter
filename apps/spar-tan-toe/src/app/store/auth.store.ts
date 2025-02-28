import { withAuth } from '@/features/auth';
import { signalStore } from '@ngrx/signals';
import { withLogger } from './utils';

export const AuthStore = signalStore({ providedIn: 'root' }, withLogger('auth'), withAuth());
