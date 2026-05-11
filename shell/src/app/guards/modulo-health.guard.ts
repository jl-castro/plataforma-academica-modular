import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { MicrofrontendHealthService } from '../services/microfrontend-health.service';

@Injectable({ providedIn: 'root' })
export class ModuloHealthGuard implements CanActivate {
  constructor(
    private readonly healthService: MicrofrontendHealthService,
    private readonly router: Router,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const moduloId = route.data['moduloId'] as string | undefined;

    if (!moduloId) {
      return true;
    }

    const estado = await this.healthService.checkNow(moduloId);

    if (estado === 'offline') {
      void this.router.navigate(['/modulo-error'], {
        queryParams: { modulo: moduloId },
        skipLocationChange: true,
      });
      return false;
    }

    return true;
  }
}
