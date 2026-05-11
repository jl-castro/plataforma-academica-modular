import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EventBusService } from '../services/event-bus.service';

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

  constructor(
    private readonly http: HttpClient,
    private readonly eventBus: EventBusService,
  ) {}

  ngOnInit(): void {
    this.http.get<Estudiante[]>('assets/data/estudiantes.json').subscribe({
      next: (lista) => {
        this.estudiantes = lista;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la lista de estudiantes.';
        this.cargando = false;
      },
    });
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
    this.eventBus.emit('estudiante.seleccionado', {
      id: est.id,
      nombre: est.nombre,
      codigo: est.codigo,
      carrera: est.carrera,
      semestre: est.semestre,
    });
  }
}
