import { APP_INITIALIZER, NgModule, Provider } from '@angular/core';
import { Router, RouterModule, Routes, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { EventBusService } from './services/event-bus.service';

export function pamModuloCargadoListenerFactory(
  router: Router,
  bus: EventBusService,
): () => Promise<void> {
  return () => {
    router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const path = (e.urlAfterRedirects.split('?')[0] || '').replace(/\/+$/, '') || '/';
        const modulos = ['estudiantes', 'inscripciones', 'calificaciones'] as const;
        for (const modulo of modulos) {
          const base = `/${modulo}`;
          if (path === base || path.startsWith(`${base}/`)) {
            bus.emit('modulo.cargado', {
              modulo,
              timestamp: new Date().toISOString(),
            });
            break;
          }
        }
      });
    return Promise.resolve();
  };
}

export const PAM_MODULO_CARGADO_INITIALIZER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: pamModuloCargadoListenerFactory,
  deps: [Router, EventBusService],
};

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'estudiantes' },
  {
    path: 'estudiantes',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './Module',
      }).then((m) => m.EstudiantesModule),
  },
  {
    path: 'inscripciones',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        exposedModule: './Module',
      }).then((m) => m.InscripcionesModule),
  },
  {
    path: 'calificaciones',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4203/remoteEntry.js',
        exposedModule: './Module',
      }).then((m) => m.CalificacionesModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
