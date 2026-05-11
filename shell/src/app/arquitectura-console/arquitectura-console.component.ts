import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { EventLog } from '../services/event-bus.service';

interface ConsoleLine {
  id: string;
  hora: string;
  direction: string;
  evento: string;
  resumen: string;
}

@Component({
  selector: 'app-arquitectura-console',
  standalone: false,
  templateUrl: './arquitectura-console.component.html',
  styleUrl: './arquitectura-console.component.scss',
})
export class ArquitecturaConsoleComponent implements OnInit, OnDestroy, AfterViewChecked {
  private readonly cdr = inject(ChangeDetectorRef);
  private pollingInterval: any;
  private scrollPending = false;

  @ViewChild('logBody') private logBody?: ElementRef<HTMLElement>;

  protected lineas: ConsoleLine[] = [];

  ngOnInit(): void {
    this.pollingInterval = setInterval(() => {
      const bus = (window as any).__PAM_EVENT_BUS__;
      if (bus) {
        this.setLogs([...bus.getLogs()]);
      }
    }, 500);
  }

  ngOnDestroy(): void {
    clearInterval(this.pollingInterval);
  }

  ngAfterViewChecked(): void {
    if (!this.scrollPending || !this.logBody) {
      return;
    }
    const element = this.logBody.nativeElement;
    element.scrollTop = element.scrollHeight;
    this.scrollPending = false;
  }

  protected limpiar(): void {
    const bus = (window as any).__PAM_EVENT_BUS__;
    if (bus) {
      bus.clearLogs();
    }
    this.lineas = [];
    this.cdr.markForCheck();
  }

  private setLogs(logs: EventLog[]): void {
    const nextLineas = logs.map((log, index) => this.toConsoleLine(log, index));
    const lastCurrent = this.lineas.at(-1)?.id;
    const lastNext = nextLineas.at(-1)?.id;
    this.scrollPending = this.lineas.length !== nextLineas.length || lastCurrent !== lastNext;
    this.lineas = nextLineas;
    this.cdr.markForCheck();
  }

  private toConsoleLine(log: EventLog, index: number): ConsoleLine {
    return {
      id: `${index}-${log.timestamp}-${log.direction}-${log.evento}`,
      hora: this.formatHora(log.timestamp),
      direction: log.direction,
      evento: log.evento,
      resumen: this.getPayloadSummary(log.evento, log.payload),
    };
  }

  private formatHora(timestamp: string): string {
    return timestamp.slice(11, 19);
  }

  private getPayloadSummary(evento: string, payload: unknown): string {
    if (payload === null || payload === undefined) {
      return '-';
    }

    if (typeof payload !== 'object') {
      return String(payload);
    }

    const record = payload as Record<string, unknown>;
    if (evento === 'modulo.cargado' && 'modulo' in record) {
      return this.toDisplayValue(record['modulo']);
    }
    if (evento === 'estudiante.seleccionado' && 'nombre' in record) {
      return this.toDisplayValue(record['nombre']);
    }

    return this.findFirstStringValue(record) ?? '-';
  }

  private toDisplayValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '-';
    }
    return String(value);
  }

  private findFirstStringValue(payload: unknown): string | null {
    if (typeof payload === 'string') {
      return payload;
    }
    if (payload === null || typeof payload !== 'object') {
      return null;
    }
    for (const value of Object.values(payload as Record<string, unknown>)) {
      const stringValue = this.findFirstStringValue(value);
      if (stringValue) {
        return stringValue;
      }
    }
    return null;
  }
}
