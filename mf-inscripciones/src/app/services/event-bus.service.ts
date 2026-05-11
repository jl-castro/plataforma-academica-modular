import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

export type EventBusDirection = 'out' | 'in';

export interface EventBusLogEntry {
	timestamp: Date;
	evento: string;
	payload: unknown;
	direction: EventBusDirection;
}

@Injectable({ providedIn: 'root' })
export class EventBusService {
	private readonly bus = new Subject<{ evento: string; payload: unknown }>();
	private readonly logs: EventBusLogEntry[] = [];

	emit(evento: string, payload: unknown): void {
		this.logs.push({
			timestamp: new Date(),
			evento,
			payload,
			direction: 'out',
		});
		this.bus.next({ evento, payload });
	}

	on(evento: string): Observable<unknown> {
		return this.bus.pipe(
			filter((e) => e.evento === evento),
			tap((e) => {
				this.logs.push({
					timestamp: new Date(),
					evento,
					payload: e.payload,
					direction: 'in',
				});
			}),
			map((e) => e.payload),
		);
	}

	getLogs(): EventBusLogEntry[] {
		return [...this.logs];
	}

	clearLogs(): void {
		this.logs.length = 0;
	}
}
