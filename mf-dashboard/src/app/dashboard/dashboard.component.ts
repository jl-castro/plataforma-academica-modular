import { Component, OnInit } from '@angular/core';
import dashboardJson from '../../assets/data/dashboard.json';
import inscripcionesJson from '../../../../mf-inscripciones/src/assets/data/inscripciones.json';

export interface DashboardStats {
  totalEstudiantes: number;
  totalMaterias: number;
  tasaAprobacion: number;
  promedioGeneral: number;
  porCarrera: { nombre: string; cantidad: number }[];
  porSemestre: { semestre: number; cantidad: number }[];
}

export interface InscripcionFuente {
  id: number;
  estudianteId: number;
  materia: string;
  codigo: string;
  creditos: number;
  estado: 'Inscrito' | 'Pendiente' | 'Retirado';
}

export interface MateriaDemanda {
  materia: string;
  codigo: string;
  inscritos: number;
  creditos: number;
}

export interface KpiCard {
  icon: string;
  label: string;
  value: string;
  hint?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  materiasDemanda: MateriaDemanda[] = [];
  loading = true;
  errorCarga = false;

  readonly skeletonItems = [1, 2, 3, 4];
  readonly skeletonBars = [1, 2, 3, 4, 5];

  private readonly inscripcionesFuente = inscripcionesJson as InscripcionFuente[];

  ngOnInit(): void {
    this.materiasDemanda = this.calcularDemandaMaterias(this.inscripcionesFuente);

    try {
      this.stats = dashboardJson as DashboardStats;
      this.errorCarga = false;
    } catch {
      this.stats = null;
      this.errorCarga = true;
    } finally {
      this.loading = false;
    }
  }

  get kpis(): KpiCard[] {
    if (!this.stats) {
      return [];
    }
    return [
      {
        icon: 'users',
        label: 'Estudiantes',
        value: String(this.stats.totalEstudiantes),
        hint: 'Registros activos',
      },
      {
        icon: 'book-open',
        label: 'Materias activas',
        value: String(this.stats.totalMaterias),
        hint: 'Oferta curricular',
      },
      {
        icon: 'award',
        label: 'Tasa de aprobación',
        value: `${this.stats.tasaAprobacion}%`,
        hint: 'Materias concluidas',
      },
      {
        icon: 'trending-up',
        label: 'Promedio general',
        value: String(this.stats.promedioGeneral),
        hint: 'Escala / 100',
      },
    ];
  }

  get maxInscritosMateria(): number {
    if (this.materiasDemanda.length === 0) {
      return 1;
    }
    return Math.max(...this.materiasDemanda.map((m) => m.inscritos));
  }

  porcentajeDemanda(inscritos: number): number {
    return (inscritos / this.maxInscritosMateria) * 100;
  }

  private calcularDemandaMaterias(filas: InscripcionFuente[]): MateriaDemanda[] {
    const mapa = new Map<string, MateriaDemanda>();

    for (const fila of filas) {
      if (fila.estado !== 'Inscrito') {
        continue;
      }
      const existente = mapa.get(fila.codigo);
      if (existente) {
        existente.inscritos += 1;
      } else {
        mapa.set(fila.codigo, {
          materia: fila.materia,
          codigo: fila.codigo,
          inscritos: 1,
          creditos: fila.creditos,
        });
      }
    }

    return [...mapa.values()]
      .sort((a, b) => b.inscritos - a.inscritos)
      .slice(0, 8);
  }
}
