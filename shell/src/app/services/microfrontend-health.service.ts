import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ManifestService, MicrofrontendManifestEntry } from './manifest.service';

export type ModuloEstado = 'online' | 'offline' | 'unknown';

export interface ModuloHealth {
  id: string;
  nombre: string;
  remoteEntry: string;
  estado: ModuloEstado;
}

@Injectable({ providedIn: 'root' })
export class MicrofrontendHealthService implements OnDestroy {
  private healthMap = new Map<string, BehaviorSubject<ModuloHealth>>();
  private intervalo?: ReturnType<typeof setInterval>;
  private resolveReady: () => void = () => {};
  private readonly readyPromise = new Promise<void>((resolve) => {
    this.resolveReady = resolve;
  });

  constructor(private readonly manifestService: ManifestService) {
    this.manifestService.getModulos().subscribe({
      next: (modulos) => {
        Object.values(modulos).forEach((modulo) => this.registerModulo(modulo));
        this.startMonitoring();
        this.resolveReady();
      },
      error: () => this.resolveReady(),
    });
  }

  private registerModulo(modulo: MicrofrontendManifestEntry): void {
    const existing = this.healthMap.get(modulo.id);

    if (existing) {
      existing.next({
        ...existing.getValue(),
        id: modulo.id,
        nombre: modulo.nombre,
        remoteEntry: modulo.remoteEntry,
      });
      return;
    }

    this.healthMap.set(
      modulo.id,
      new BehaviorSubject<ModuloHealth>({
        id: modulo.id,
        nombre: modulo.nombre,
        remoteEntry: modulo.remoteEntry,
        estado: 'unknown',
      }),
    );
  }

  private startMonitoring(): void {
    if (this.intervalo) {
      return;
    }

    this.checkAll();
    this.intervalo = setInterval(() => this.checkAll(), 30000);
  }

  private checkAll(): void {
    this.healthMap.forEach((subject, id) => {
      void this.checkSubject(id, subject, true);
    });
  }

  private async checkSubject(
    id: string,
    subject: BehaviorSubject<ModuloHealth>,
    emitChanges: boolean,
  ): Promise<ModuloEstado> {
    const current = subject.getValue();

    try {
      const res = await fetch(current.remoteEntry, { cache: 'no-store', method: 'HEAD' });
      const estado: ModuloEstado = res.ok ? 'online' : 'offline';
      this.updateEstado(id, subject, estado, emitChanges);
      return estado;
    } catch {
      this.updateEstado(id, subject, 'offline', emitChanges);
      return 'offline';
    }
  }

  private updateEstado(
    id: string,
    subject: BehaviorSubject<ModuloHealth>,
    estado: ModuloEstado,
    emitChanges: boolean,
  ): void {
    const current = subject.getValue();

    if (estado === current.estado) {
      return;
    }

    subject.next({ ...current, estado });

    if (emitChanges) {
      this.emitirCambio(id, current.nombre, estado);
    }
  }

  private emitirCambio(id: string, nombre: string, estado: ModuloEstado): void {
    const bus = (window as any).__PAM_EVENT_BUS__;
    if (!bus || estado === 'unknown') {
      return;
    }

    const evento = estado === 'online' ? 'modulo.reconectado' : 'modulo.desconectado';
    const direction = estado === 'online' ? 'recibido' : 'error';
    const payload = { modulo: id, nombre, timestamp: new Date().toISOString() };

    bus.emit(evento, payload);
    bus.log(evento, { modulo: id, nombre }, direction);
  }

  getHealth(id: string): Observable<ModuloHealth> {
    if (!this.healthMap.has(id)) {
      this.healthMap.set(
        id,
        new BehaviorSubject<ModuloHealth>({
          id,
          nombre: id,
          remoteEntry: '',
          estado: 'unknown',
        }),
      );
    }

    return this.healthMap.get(id)!.asObservable();
  }

  getAllHealth(): Observable<ModuloHealth>[] {
    return Array.from(this.healthMap.values()).map((subject) => subject.asObservable());
  }

  async checkNow(id: string): Promise<ModuloEstado> {
    await this.readyPromise;

    const subject = this.healthMap.get(id);

    if (!subject) {
      return 'unknown';
    }

    if (!subject.getValue().remoteEntry) {
      subject.next({
        id,
        nombre: id,
        remoteEntry: '',
        estado: 'unknown',
      });
      return 'unknown';
    }

    return this.checkSubject(id, subject, true);
  }

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }
}
