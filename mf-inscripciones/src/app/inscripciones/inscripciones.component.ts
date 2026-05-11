import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subject, Subscription, switchMap, takeUntil, tap, timer } from 'rxjs';
import { EventBusService } from '../services/event-bus.service';

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

	protected estudianteSeleccionado: EstudianteSeleccionado | null = null;
	protected inscripciones: InscripcionItem[] = [];
	protected totalCreditos = 0;
	protected eventoBannerVisible = false;
	protected eventoBannerText = '';

	constructor(
		private readonly http: HttpClient,
		private readonly eventBus: EventBusService,
	) {}

	ngOnInit(): void {
		this.eventBus
			.on('estudiante.seleccionado')
			.pipe(
				takeUntil(this.destroy$),
				tap((payload) => this.onEstudianteEvento(payload)),
				switchMap(() =>
					this.http.get<InscripcionItem[]>('assets/data/inscripciones.json'),
				),
				map((lista) =>
					lista.filter((i) => i.estudianteId === this.estudianteSeleccionado?.id),
				),
			)
			.subscribe({
				next: (filtradas) => {
					this.inscripciones = filtradas;
					this.totalCreditos = filtradas.reduce((acc, cur) => acc + cur.creditos, 0);
				},
				error: () => {
					this.inscripciones = [];
					this.totalCreditos = 0;
				},
			});
	}

	ngOnDestroy(): void {
		this.eventLogTimerSub?.unsubscribe();
		this.destroy$.next();
		this.destroy$.complete();
	}

	protected get hayEstudiante(): boolean {
		return this.estudianteSeleccionado !== null;
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
			if (!Number.isNaN(id)) {
				return { id, nombre };
			}
		}
		return { id: 0, nombre: 'Estudiante' };
	}
}
