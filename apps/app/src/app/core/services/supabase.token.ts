// const [injectDocumentClick] = createInjectionToken(() => {
// 	const click$ = new Subject<Event>()
// 	const [ngZone, document] = [inject(NgZone), inject(DOCUMENT)]

import { SupabaseClientService } from '@agora/supabase/core';
import { NgZone, inject } from '@angular/core';
import type { REALTIME_LISTEN_TYPES, RealtimePostgresChangesFilter } from '@supabase/supabase-js';
import { Subject } from 'rxjs';

// 	ngZone.runOutsideAngular(() => {
// 		fromEvent(document, 'click').subscribe(click$)
// 	})

// 	return click$
// })

interface SupabaseRealTime {
	channelId: string;
	listenerType: REALTIME_LISTEN_TYPES;
	filterOptions: RealtimePostgresChangesFilter<any>;
}

export function supabaseChannelSubscription({ channelId, listenerType, filterOptions }: SupabaseRealTime) {
	const supabase = inject(SupabaseClientService);
	const ngZone = inject(NgZone);
	const event$ = new Subject<Event>();

	ngZone.runOutsideAngular(() => {
		supabase.client
			.channel(channelId)
			.on(
				listenerType,
				filterOptions,
				// {
				// 	event: 'UPDATE',
				// 	schema: 'public',
				// 	table: 'game',
				// 	filter: `id=eq.${gameId}`,
				// },
				(payload) => event$.next(payload),
			)
			.subscribe();
	});
	return event$;
}
