import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface EventLog {
  timestamp: string;
  evento: string;
  payload: any;
  direction: 'emitido' | 'recibido' | 'error';
}

@Injectable()
export class EventBusService {
  private subjects = new Map<string, BehaviorSubject<any>>();
  private logs: EventLog[] = [];

  constructor() {
    (window as any).__PAM_EVENT_BUS__ = this;
  }

  private getSubject(evento: string): BehaviorSubject<any> {
    if (!this.subjects.has(evento)) {
      this.subjects.set(evento, new BehaviorSubject<any>(null));
    }
    return this.subjects.get(evento)!;
  }

  emit(evento: string, payload: any): void {
    const timestamp = new Date().toISOString();
    this.logs.push({
      timestamp,
      evento,
      payload,
      direction: 'emitido',
    });
    this.getSubject(evento).next({ payload, timestamp });
  }

  on(evento: string): Observable<any> {
    return this.getSubject(evento).pipe(
      filter((value) => value !== null),
      map((value) => value.payload),
    );
  }

  log(evento: string, payload: any, direction: 'emitido' | 'recibido' | 'error'): void {
    this.logs.push({
      timestamp: new Date().toISOString(),
      evento,
      payload,
      direction,
    });
  }

  getLogs(): EventLog[] {
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const eventBusInstance = new EventBusService();
