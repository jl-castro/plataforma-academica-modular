import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import calificacionesJson from '../../assets/data/calificaciones.json';
import { EventBusLoaderService } from '../services/event-bus-loader.service';

export interface EstudianteSeleccionadoPayload {
  id: number;
  nombre: string;
  codigo: string;
  carrera: string;
  semestre: number;
}

export interface Calificacion {
  id: number;
  estudianteId: number;
  materia: string;
  codigo: string;
  primerParcial: number;
  segundoParcial: number;
  examenFinal: number | null;
  periodo: string;
}

export interface DistribucionNotas {
  excelente: number;
  bueno: number;
  suficiente: number;
  reprobado: number;
  total: number;
}

@Component({
  selector: 'app-calificaciones',
  standalone: false,
  templateUrl: './calificaciones.component.html',
  styleUrls: ['./calificaciones.component.scss'],
})
export class CalificacionesComponent implements OnInit, OnDestroy {
  estudiante: EstudianteSeleccionadoPayload | null = null;
  calificaciones: Calificacion[] = [];
  todasLasCalificaciones: Calificacion[] | null = null;
  cargandoDatos = false;
  errorCarga: string | null = null;

  textoBannerEvento: string | null = null;
  private bannerTimeoutId: ReturnType<typeof setTimeout> | null = null;

  totalMaterias = 0;
  materiasAprobadas = 0;
  materiasReprobadas = 0;
  distribucionNotas: DistribucionNotas = {
    excelente: 0,
    bueno: 0,
    suficiente: 0,
    reprobado: 0,
    total: 0,
  };

  private readonly subs = new Subscription();

  constructor(private readonly eventBusLoader: EventBusLoaderService) {}

  ngOnInit(): void {
    void this.eventBusLoader.getEventBus().then((bus) => {
      this.subs.add(
        bus.on('estudiante.seleccionado').subscribe((payload: unknown) => {
          this.estudiante = payload as EstudianteSeleccionadoPayload;
          this.mostrarBannerEvento(this.estudiante.nombre);
          this.cargarCalificaciones(this.estudiante.id);
        }),
      );
    });
  }

  ngOnDestroy(): void {
    if (this.bannerTimeoutId !== null) {
      clearTimeout(this.bannerTimeoutId);
    }
    this.subs.unsubscribe();
  }

  calcularTotal(cal: Calificacion): number {
    return cal.primerParcial + cal.segundoParcial + (cal.examenFinal ?? 0);
  }

  getEstado(cal: Calificacion): string {
    if (cal.examenFinal === null) {
      return 'En curso';
    }
    const total = this.calcularTotal(cal);
    if (total >= 51) {
      return 'Aprobado';
    }
    return 'Reprobado';
  }

  calcularPromedio(calificaciones: Calificacion[]): number {
    const finalizadas = calificaciones.filter(
      (c) => c.examenFinal !== null && c.examenFinal !== undefined,
    );
    if (finalizadas.length === 0) {
      return 0;
    }
    const suma = finalizadas.reduce((acc, c) => acc + this.calcularTotal(c), 0);
    return Math.round((suma / finalizadas.length) * 10) / 10;
  }

  claseEstado(cal: Calificacion): string {
    const estado = this.getEstado(cal);
    if (estado === 'Aprobado') {
      return 'estado-aprobado';
    }
    if (estado === 'Reprobado') {
      return 'estado-reprobado';
    }
    return 'estado-curso';
  }

  porcentajeDistribucion(cantidad: number): number {
    if (this.distribucionNotas.total === 0) {
      return 0;
    }
    return (cantidad / this.distribucionNotas.total) * 100;
  }

  private mostrarBannerEvento(nombreEstudiante: string): void {
    if (this.bannerTimeoutId !== null) {
      clearTimeout(this.bannerTimeoutId);
    }
    this.textoBannerEvento = `📥 Evento recibido: estudiante.seleccionado → ${nombreEstudiante}`;
    this.bannerTimeoutId = setTimeout(() => {
      this.textoBannerEvento = null;
      this.bannerTimeoutId = null;
    }, 3000);
  }

  private cargarCalificaciones(estudianteId: number): void {
    if (!this.estudiante || this.estudiante.id !== estudianteId) {
      return;
    }
    this.errorCarga = null;
    if (this.todasLasCalificaciones) {
      this.aplicarFiltroYResumen();
      return;
    }
    this.cargandoDatos = true;
    this.errorCarga = null;
    try {
      this.todasLasCalificaciones = calificacionesJson as Calificacion[];
      this.cargandoDatos = false;
      this.aplicarFiltroYResumen();
    } catch {
      this.cargandoDatos = false;
      this.errorCarga = 'No se pudieron cargar las calificaciones.';
      this.calificaciones = [];
      this.reiniciarResumen();
    }
  }

  private aplicarFiltroYResumen(): void {
    if (!this.estudiante || !this.todasLasCalificaciones) {
      return;
    }
    this.calificaciones = this.todasLasCalificaciones.filter(
      (c) => c.estudianteId === this.estudiante!.id,
    );
    this.recalcularResumen();
  }

  private reiniciarResumen(): void {
    this.totalMaterias = 0;
    this.materiasAprobadas = 0;
    this.materiasReprobadas = 0;
    this.distribucionNotas = {
      excelente: 0,
      bueno: 0,
      suficiente: 0,
      reprobado: 0,
      total: 0,
    };
  }

  private recalcularResumen(): void {
    this.totalMaterias = this.calificaciones.length;
    let aprobados = 0;
    let reprobados = 0;
    let ex = 0;
    let bu = 0;
    let suf = 0;
    let rep = 0;

    for (const c of this.calificaciones) {
      if (c.examenFinal === null) {
        continue;
      }
      const total = this.calcularTotal(c);
      if (total >= 51) {
        aprobados++;
      } else {
        reprobados++;
      }
      if (total >= 90) {
        ex++;
      } else if (total >= 70) {
        bu++;
      } else if (total >= 51) {
        suf++;
      } else {
        rep++;
      }
    }

    this.materiasAprobadas = aprobados;
    this.materiasReprobadas = reprobados;
    const totalDistrib = ex + bu + suf + rep;
    this.distribucionNotas = {
      excelente: ex,
      bueno: bu,
      suficiente: suf,
      reprobado: rep,
      total: totalDistrib,
    };
  }
}
