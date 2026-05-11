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
