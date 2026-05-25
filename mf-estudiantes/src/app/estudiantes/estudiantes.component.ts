import { Component, OnInit } from '@angular/core';
import estudiantesJson from '../../assets/data/estudiantes.json';
import { EventBusLoaderService } from '../services/event-bus-loader.service';

export interface Estudiante {
  id: number;
  nombre: string;
  codigo: string;
  carrera: string;
  semestre: number;
  email: string;
}

@Component({
  selector: 'app-estudiantes',
  standalone: false,
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss'],
})
export class EstudiantesComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  cargando = true;
  error: string | null = null;
  seleccionId: number | null = null;
  mensajeSeleccion: string | null = null;

  busqueda = '';
  filtroCarrera = '';
  filtroSemestre: number | null = null;

  private eventBus: any = null;
  private readonly busReady: Promise<void>;

  constructor(private readonly eventBusLoader: EventBusLoaderService) {
    this.busReady = this.eventBusLoader.getEventBus().then((bus) => {
      this.eventBus = bus;
    });
  }

  ngOnInit(): void {
    try {
      this.estudiantes = estudiantesJson as Estudiante[];
    } catch {
      this.error = 'No se pudo cargar la lista de estudiantes.';
    } finally {
      this.cargando = false;
    }
  }

  get carrerasDisponibles(): string[] {
    return [...new Set(this.estudiantes.map((est) => est.carrera))].sort();
  }

  get semestresDisponibles(): number[] {
    return [...new Set(this.estudiantes.map((est) => est.semestre))].sort(
      (a, b) => a - b,
    );
  }

  get estudiantesFiltrados(): Estudiante[] {
    const termino = this.busqueda.trim().toLowerCase();
    return this.estudiantes.filter((est) => {
      if (this.filtroCarrera && est.carrera !== this.filtroCarrera) {
        return false;
      }
      if (this.filtroSemestre !== null && est.semestre !== this.filtroSemestre) {
        return false;
      }
      if (!termino) {
        return true;
      }
      return (
        est.nombre.toLowerCase().includes(termino) ||
        est.codigo.toLowerCase().includes(termino) ||
        est.carrera.toLowerCase().includes(termino)
      );
    });
  }

  get estudianteActivo(): Estudiante | null {
    if (this.seleccionId === null) {
      return null;
    }
    return (
      this.estudiantes.find((est) => est.id === this.seleccionId) ?? null
    );
  }

  get hayFiltrosActivos(): boolean {
    return (
      this.busqueda.trim().length > 0 ||
      this.filtroCarrera !== '' ||
      this.filtroSemestre !== null
    );
  }

  get totalCarreras(): number {
    return new Set(this.estudiantes.map((est) => est.carrera)).size;
  }

  get semestrePromedio(): number {
    if (this.estudiantes.length === 0) {
      return 0;
    }
    const total = this.estudiantes.reduce((acc, est) => acc + est.semestre, 0);
    return Math.round((total / this.estudiantes.length) * 10) / 10;
  }

  iniciales(nombre: string): string {
    const partes = nombre.trim().split(/\s+/).filter((p) => p.length > 0);
    if (partes.length === 0) {
      return '?';
    }
    if (partes.length === 1) {
      return partes[0].slice(0, 2).toUpperCase();
    }
    const a = partes[0].charAt(0);
    const b = partes[partes.length - 1].charAt(0);
    return (a + b).toUpperCase();
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.filtroCarrera = '';
    this.filtroSemestre = null;
  }

  onBusquedaInput(valor: string): void {
    this.busqueda = valor;
  }

  seleccionar(est: Estudiante): void {
    this.seleccionId = est.id;
    this.mensajeSeleccion = `Estudiante seleccionado: ${est.nombre}`;
    void this.busReady.then(() => {
      this.eventBus?.emit('estudiante.seleccionado', {
        id: est.id,
        nombre: est.nombre,
        codigo: est.codigo,
        carrera: est.carrera,
        semestre: est.semestre,
      });
    });
  }
}
