import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MicrofrontendHealthService, ModuloHealth } from '../services/microfrontend-health.service';
import { ManifestService, MicrofrontendManifestEntry } from '../services/manifest.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  modulos: MicrofrontendManifestEntry[] = [];
  healthMap = new Map<string, ModuloHealth>();
  private readonly subs: Subscription[] = [];

  constructor(
    private readonly manifestService: ManifestService,
    private readonly healthService: MicrofrontendHealthService,
  ) {}

  ngOnInit(): void {
    const manifestSub = this.manifestService.getModulos().subscribe((modulos) => {
      this.modulos = Object.values(modulos).filter((modulo) => modulo.estado === 'activo');
      this.subscribeToHealth();
    });
    this.subs.push(manifestSub);
  }

  getHealthEstado(moduloId: string): string {
    return this.healthMap.get(moduloId)?.estado ?? 'unknown';
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  private subscribeToHealth(): void {
    this.modulos.forEach((modulo) => {
      const sub = this.healthService.getHealth(modulo.id).subscribe((health) => {
        this.healthMap.set(modulo.id, health);
      });
      this.subs.push(sub);
    });
  }
}
