import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

interface LogEntry {
  timestamp: string;
  direction: string;
  evento: string;
  resumen: string;
}

@Component({
  selector: 'app-arquitectura-console',
  standalone: false,
  templateUrl: './arquitectura-console.component.html',
  styleUrls: ['./arquitectura-console.component.scss']
})
export class ArquitecturaConsoleComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('logContainer') logContainer!: ElementRef;

  logs: LogEntry[] = [];
  private pollingInterval: any;
  private lastLogCount = 0;
  private shouldScroll = false;

  ngOnInit(): void {
    this.pollingInterval = setInterval(() => {
      this.pollLogs();
    }, 300);
  }

  private pollLogs(): void {
    const bus = (window as any).__PAM_EVENT_BUS__;
    if (!bus) return;

    const rawLogs = bus.getLogs();
    if (!rawLogs || rawLogs.length === this.lastLogCount) return;

    this.lastLogCount = rawLogs.length;
    this.shouldScroll = true;

    this.logs = rawLogs.map((log: any) => ({
      timestamp: this.formatTime(log.timestamp),
      direction: log.direction || 'emitido',
      evento: log.evento || '',
      resumen: this.extractResumen(log.payload)
    }));
  }

  private formatTime(iso: string): string {
    if (!iso) return '--:--:--';
    try {
      const d = new Date(iso);
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      const s = d.getSeconds().toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    } catch {
      return '--:--:--';
    }
  }

  private extractResumen(payload: any): string {
    if (!payload) return '';
    if (typeof payload === 'string') return payload;
    if (payload.nombre) return payload.nombre;
    if (payload.modulo) return payload.modulo;
    if (payload.message) return payload.message;
    if (payload.id) return `id: ${payload.id}`;
    const first = Object.values(payload)[0];
    return first ? String(first) : '';
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll && this.logContainer) {
      const el = this.logContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.shouldScroll = false;
    }
  }

  clearLogs(): void {
    const bus = (window as any).__PAM_EVENT_BUS__;
    if (bus) bus.clearLogs();
    this.logs = [];
    this.lastLogCount = 0;
  }

  ngOnDestroy(): void {
    clearInterval(this.pollingInterval);
  }
}
