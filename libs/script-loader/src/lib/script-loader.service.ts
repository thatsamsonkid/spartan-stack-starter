import { Injectable } from '@angular/core';

@Injectable()
export class ScriptLoaderService {
	loadScript(id: string, src: string, onload: null | (() => void), parentElement?: HTMLElement | null): void {
		// get document if platform is only browser
		if (typeof document !== 'undefined' && !document.getElementById(id)) {
			const script = document.createElement('script');

			script.async = true;
			script.src = src;
			script.onload = onload;

			if (parentElement) {
				parentElement.appendChild(script);
			} else {
				document.head.appendChild(script);
			}
		}
	}
}
