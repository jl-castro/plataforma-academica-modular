import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import {
  EventBusLogEntry,
  EventBusService,
} from '../services/event-bus.service';

@Component({
  selector: 'app-arquitectura-console',
  standalone: false,
  templateUrl: './arquitectura-console.component.html',
  styleUrl: './arquitectura-console.component.scss',
})
export class ArquitecturaConsoleComponent {
  private readonly eventBus = inject(EventBusService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  protected lineas: EventBusLogEntry[] = [];

  constructor() {
    interval(400)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.lineas = [...this.eventBus.getLogs()].reverse();
        this.cdr.markForCheck();
      });
  }

  protected limpiar(): void {
    this.eventBus.clearLogs();
    this.lineas = [];
    this.cdr.markForCheck();
  }
}
