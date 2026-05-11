import { Injectable } from '@angular/core';
import { Observable, Subject, filter, map, shareReplay, tap } from 'rxjs';

export type EventBusDirection = 'emitido' | 'recibido';

export interface EventBusLogEntry {
  timestamp: string;
  evento: string;
  payload: unknown;
  direction: EventBusDirection;
}

interface HubEvent {
  evento: string;
  payload: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private readonly hub = new Subject<HubEvent>();
  private readonly logs: EventBusLogEntry[] = [];
  private readonly channelCache = new Map<string, Observable<unknown>>();

  emit(evento: string, payload: unknown): void {
    const timestamp = new Date().toISOString();
    this.logs.push({
      timestamp,
      evento,
      payload,
      direction: 'emitido',
    });
    this.hub.next({ evento, payload });
  }

  on(evento: string): Observable<unknown> {
    const existing = this.channelCache.get(evento);
    if (existing) {
      return existing;
    }
    const stream = this.hub.pipe(
      filter((e) => e.evento === evento),
      tap((e) => {
        this.logs.push({
          timestamp: new Date().toISOString(),
          evento,
          payload: e.payload,
          direction: 'recibido',
        });
      }),
      map((e) => e.payload),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.channelCache.set(evento, stream);
    return stream;
  }

  getLogs(): EventBusLogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs.length = 0;
    this.channelCache.clear();
  }
}
