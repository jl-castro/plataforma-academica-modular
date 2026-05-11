import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
    this.currentPath = this.router.url.split('?')[0];
  }

  retry(): void {
    if (this.isRetrying) return;
    this.isRetrying = true;
    this.retryFailed = false;

    // Try to fetch the remoteEntry to check if server is back up
    const remoteMap: Record<string, string> = {
      '/calificaciones': 'http://localhost:4203/remoteEntry.js',
      '/inscripciones':  'http://localhost:4202/remoteEntry.js',
      '/estudiantes':    'http://localhost:4201/remoteEntry.js',
    };

    const remoteEntry = remoteMap[this.currentPath];

    fetch(remoteEntry, { cache: 'no-store' })
      .then(res => {
        if (res.ok) {
          // Server is back — navigate to estudiantes to clear cache, then reload
          this.router.navigateByUrl('/estudiantes');
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
