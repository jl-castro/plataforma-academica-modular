import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modulo-error',
  standalone: false,
  templateUrl: './modulo-error.component.html',
  styleUrls: ['./modulo-error.component.scss']
})
export class ModuloErrorComponent {

  isRetrying = false;
  retryFailed = false;
  private currentPath = '';
  private moduloId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.currentPath = this.router.url.split('?')[0];
    this.moduloId = this.route.snapshot.queryParamMap.get('modulo') ?? this.currentPath.replace(/^\//, '');
  }

  retry(): void {
    if (this.isRetrying) return;
    this.isRetrying = true;
    this.retryFailed = false;

    // Try to fetch the remoteEntry to check if server is back up
    const remoteMap: Record<string, string> = {
      estudiantes: 'http://localhost:4201/remoteEntry.js',
      inscripciones: 'http://localhost:4202/remoteEntry.js',
      calificaciones: 'http://localhost:4203/remoteEntry.js',
      dashboard: 'http://localhost:4204/remoteEntry.js',
      '/estudiantes': 'http://localhost:4201/remoteEntry.js',
      '/inscripciones':  'http://localhost:4202/remoteEntry.js',
      '/calificaciones': 'http://localhost:4203/remoteEntry.js',
      '/dashboard': 'http://localhost:4204/remoteEntry.js',
    };

    const remoteEntry = remoteMap[this.moduloId] ?? remoteMap[this.currentPath];

    if (!remoteEntry) {
      this.isRetrying = false;
      this.retryFailed = true;
      return;
    }

    fetch(remoteEntry, { cache: 'no-store', method: 'HEAD' })
      .then(res => {
        if (res.ok) {
          this.router.navigateByUrl(`/${this.moduloId}`);
        } else {
          this.isRetrying = false;
          this.retryFailed = true;
        }
      })
      .catch(() => {
        this.isRetrying = false;
        this.retryFailed = true;
      });
  }

  goToEstudiantes(): void {
    this.router.navigateByUrl('/estudiantes');
  }
}
