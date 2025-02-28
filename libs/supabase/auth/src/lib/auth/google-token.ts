import { InjectionToken } from '@angular/core';
import type { GoogleInitOptions } from './google-auth.service';

export const GOOGLE_CLIENT_ID = new InjectionToken<string>('');
export const GOOGLE_INIT_OPTIONS = new InjectionToken<GoogleInitOptions>('');
