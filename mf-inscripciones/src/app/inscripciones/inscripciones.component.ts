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

export type FiltroEstadoInscripcion = 'Todos' | InscripcionItem['estado'];

export interface BloqueHorario {
  inscripcionId: number;
  materia: string;
  codigo: string;
  horario: string;
  diaIndex: number;
  horaInicio: number;
  horaFin: number;
  estado: InscripcionItem['estado'];
}

const MAX_CREDITOS = 30;
const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as const;

const MAPA_DIAS: Record<string, number> = {
  lunes: 0,
  martes: 1,
  miercoles: 2,
  miércoles: 2,
  jueves: 3,
  viernes: 4,
};

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

  protected readonly maxCreditos = MAX_CREDITOS;
  protected readonly diasSemana = DIAS_SEMANA;
  protected readonly filtrosEstado: FiltroEstadoInscripcion[] = [
    'Todos',
    'Inscrito',
    'Pendiente',
    'Retirado',
  ];

  protected estudianteSeleccionado: EstudianteSeleccionado | null = null;
  protected inscripciones: InscripcionItem[] = [];
  protected totalCreditos = 0;
  protected filtroEstado: FiltroEstadoInscripcion = 'Todos';
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

  protected get inscripcionesVisibles(): InscripcionItem[] {
    if (this.filtroEstado === 'Todos') {
      return this.inscripciones;
    }
    return this.inscripciones.filter((ins) => ins.estado === this.filtroEstado);
  }

  protected get creditosInscritos(): number {
    return this.inscripciones
      .filter((ins) => ins.estado === 'Inscrito')
      .reduce((acc, ins) => acc + ins.creditos, 0);
  }

  protected get porcentajeCreditos(): number {
    return Math.min(100, (this.creditosInscritos / MAX_CREDITOS) * 100);
  }

  protected get creditosDisponibles(): number {
    return Math.max(0, MAX_CREDITOS - this.creditosInscritos);
  }

  protected get maxCreditosMateria(): number {
    if (this.inscripcionesVisibles.length === 0) {
      return 1;
    }
    return Math.max(...this.inscripcionesVisibles.map((ins) => ins.creditos));
  }

  protected get bloquesHorario(): BloqueHorario[] {
    const bloques: BloqueHorario[] = [];
    for (const ins of this.inscripcionesVisibles) {
      const parsed = this.parsearHorario(ins.horario);
      if (!parsed) {
        continue;
      }
      for (const diaIndex of parsed.dias) {
        bloques.push({
          inscripcionId: ins.id,
          materia: ins.materia,
          codigo: ins.codigo,
          horario: ins.horario,
          diaIndex,
          horaInicio: parsed.inicio,
          horaFin: parsed.fin,
          estado: ins.estado,
        });
      }
    }
    return bloques;
  }

  protected bloquesPorDia(diaIndex: number): BloqueHorario[] {
    return this.bloquesHorario
      .filter((b) => b.diaIndex === diaIndex)
      .sort((a, b) => a.horaInicio - b.horaInicio);
  }

  protected alturaBloque(bloque: BloqueHorario): number {
    const duracion = Math.max(1, bloque.horaFin - bloque.horaInicio);
    return Math.min(120, 36 + duracion * 14);
  }

  protected contarPorEstado(estado: InscripcionItem['estado']): number {
    return this.inscripciones.filter((ins) => ins.estado === estado).length;
  }

  protected setFiltroEstado(filtro: FiltroEstadoInscripcion): void {
    this.filtroEstado = filtro;
  }

  protected porcentajeCreditosMateria(creditos: number): number {
    return (creditos / this.maxCreditosMateria) * 100;
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

  protected claseBloque(estado: InscripcionItem['estado']): string {
    switch (estado) {
      case 'Inscrito':
        return 'calendario__bloque--inscrito';
      case 'Pendiente':
        return 'calendario__bloque--pendiente';
      case 'Retirado':
        return 'calendario__bloque--retirado';
      default:
        return '';
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

  private parsearHorario(
    horario: string,
  ): { dias: number[]; inicio: number; fin: number } | null {
    const tiempo = horario.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (!tiempo) {
      return null;
    }
    const inicio = parseInt(tiempo[1], 10) + parseInt(tiempo[2], 10) / 60;
    const fin = parseInt(tiempo[3], 10) + parseInt(tiempo[4], 10) / 60;
    const lower = horario
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '');
    const dias: number[] = [];
    for (const [nombre, idx] of Object.entries(MAPA_DIAS)) {
      const clave = nombre.normalize('NFD').replace(/\p{M}/gu, '');
      if (lower.includes(clave)) {
        dias.push(idx);
      }
    }
    if (dias.length === 0) {
      return null;
    }
    return { dias, inicio, fin };
  }

  private onEstudianteEvento(payload: unknown): void {
    const estudiante = this.normalizarEstudiante(payload);
    this.estudianteSeleccionado = estudiante;
    this.filtroEstado = 'Todos';

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
