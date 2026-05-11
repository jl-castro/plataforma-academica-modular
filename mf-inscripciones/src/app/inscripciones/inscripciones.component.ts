import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, takeUntil, timer } from 'rxjs';
import inscripcionesJson from '../../assets/data/inscripciones.json';
import { EventBusLoaderService } from '../services/event-bus-loader.service';

export interface InscripcionItem {
  id: number;
  estudianteId: number;
  materia: string;
  codigo: string;
  creditos: number;
  horario: string;
  docente: string;
  estado: 'Inscrito' | 'Pendiente' | 'Retirado';
}

export interface EstudianteSeleccionado {
  id: number;
  nombre: string;
  codigo: string;
  carrera: string;
}

@Component({
  selector: 'app-inscripciones',
  standalone: false,
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.scss'],
})
export class InscripcionesComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private eventLogTimerSub: Subscription | null = null;
  private busSubscription: Subscription | null = null;

  protected estudianteSeleccionado: EstudianteSeleccionado | null = null;
  protected inscripciones: InscripcionItem[] = [];
  protected totalCreditos = 0;
  protected eventoBannerVisible = false;
  protected eventoBannerText = '';

  private todasLasInscripciones: InscripcionItem[] | null = null;

  constructor(private readonly eventBusLoader: EventBusLoaderService) {}

  ngOnInit(): void {
    void this.eventBusLoader.getEventBus().then((bus) => {
      this.busSubscription = bus
        .on('estudiante.seleccionado')
        .pipe(takeUntil(this.destroy$))
        .subscribe((estudiante: unknown) => {
          const globalBus = (window as any).__PAM_EVENT_BUS__;
          if (globalBus) globalBus.log('estudiante.seleccionado', estudiante, 'recibido');
          this.onEstudianteEvento(estudiante);
          const id = this.estudianteSeleccionado?.id;
          if (id) {
            this.cargarInscripciones(id);
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.busSubscription?.unsubscribe();
    this.eventLogTimerSub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected get hayEstudiante(): boolean {
    return this.estudianteSeleccionado !== null;
  }

  protected get materiasInscritas(): number {
    return this.inscripciones.filter((ins) => ins.estado === 'Inscrito').length;
  }

  protected get materiasPendientes(): number {
    return this.inscripciones.filter((ins) => ins.estado === 'Pendiente').length;
  }

  protected claseEstado(estado: InscripcionItem['estado']): string {
    switch (estado) {
      case 'Inscrito':
        return 'badge badge--inscrito';
      case 'Pendiente':
        return 'badge badge--pendiente';
      case 'Retirado':
        return 'badge badge--retirado';
      default:
        return 'badge';
    }
  }

  protected cargarInscripciones(estudianteId: number): void {
    if (!estudianteId) {
      this.inscripciones = [];
      this.totalCreditos = 0;
      return;
    }
    if (!this.todasLasInscripciones) {
      this.todasLasInscripciones = inscripcionesJson as InscripcionItem[];
    }
    const filtradas = this.todasLasInscripciones.filter(
      (i) => i.estudianteId === estudianteId,
    );
    this.inscripciones = filtradas;
    this.totalCreditos = filtradas.reduce((acc, cur) => acc + cur.creditos, 0);
  }

  private onEstudianteEvento(payload: unknown): void {
    const estudiante = this.normalizarEstudiante(payload);
    this.estudianteSeleccionado = estudiante;

    this.eventLogTimerSub?.unsubscribe();
    this.eventoBannerText = `📥 Evento recibido: estudiante.seleccionado → ${estudiante.nombre}`;
    this.eventoBannerVisible = true;
    this.eventLogTimerSub = timer(3000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.eventoBannerVisible = false;
      });
  }

  private normalizarEstudiante(payload: unknown): EstudianteSeleccionado {
    if (payload && typeof payload === 'object') {
      const p = payload as Record<string, unknown>;
      const id = Number(p['id'] ?? p['estudianteId']);
      const nombre = String(p['nombre'] ?? p['nombres'] ?? 'Estudiante');
      const codigo = String(p['codigo'] ?? '');
      const carrera = String(p['carrera'] ?? '');
      if (!Number.isNaN(id)) {
        return { id, nombre, codigo, carrera };
      }
    }
    return { id: 0, nombre: 'Estudiante', codigo: '', carrera: '' };
  }
}
