import { APP_INITIALIZER, NgModule, Provider } from '@angular/core';
import { NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { filter } from 'rxjs';

const failedModulos = new Set<string>();
const modulos = ['estudiantes', 'inscripciones', 'calificaciones'] as const;

function emitModuloCargado(modulo: string): void {
  const tryEmit = (attempts: number) => {
    const bus = (window as any).__PAM_EVENT_BUS__;
    if (bus) {
      bus.emit('modulo.cargado', {
        modulo,
        timestamp: new Date().toISOString(),
      });
    } else if (attempts > 0) {
      setTimeout(() => tryEmit(attempts - 1), 200);
    }
  };
  tryEmit(10);
}

function emitModuloError(modulo: string, error: any): void {
  const tryEmit = (attempts: number) => {
    const bus = (window as any).__PAM_EVENT_BUS__;
    if (bus) {
      bus.emit('modulo.error', {
        modulo,
        mensaje: error?.message || 'Error de conexión',
        timestamp: new Date().toISOString()
      });
      bus.log('modulo.error', { modulo, mensaje: error?.message || 'Error de conexión' }, 'error');
    } else if (attempts > 0) {
      setTimeout(() => tryEmit(attempts - 1), 200);
    }
  };
  tryEmit(10);
}

export function pamModuloCargadoListenerFactory(router: Router): () => Promise<void> {
  return () => {
    router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const path = (event.urlAfterRedirects.split('?')[0] || '').replace(/\/+$/, '') || '/';
        for (const modulo of modulos) {
          const base = `/${modulo}`;
          if ((path === base || path.startsWith(`${base}/`)) && !failedModulos.has(modulo)) {
            emitModuloCargado(modulo);
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
  deps: [Router],
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
      })
        .then((m) => {
          failedModulos.delete('estudiantes');
          return m.EstudiantesModule;
        })
        .catch((err) => {
          failedModulos.add('estudiantes');
          emitModuloError('estudiantes', err);
          return import('./modulo-error/modulo-error.module').then((m) => m.ModuloErrorModule);
        }),
  },
  {
    path: 'inscripciones',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        exposedModule: './Module',
      })
        .then((m) => {
          failedModulos.delete('inscripciones');
          return m.InscripcionesModule;
        })
        .catch((err) => {
          failedModulos.add('inscripciones');
          emitModuloError('inscripciones', err);
          return import('./modulo-error/modulo-error.module').then((m) => m.ModuloErrorModule);
        }),
  },
  {
    path: 'calificaciones',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4203/remoteEntry.js',
        exposedModule: './Module',
      })
        .then((m) => {
          failedModulos.delete('calificaciones');
          return m.CalificacionesModule;
        })
        .catch((err) => {
          failedModulos.add('calificaciones');
          emitModuloError('calificaciones', err);
          return import('./modulo-error/modulo-error.module').then((m) => m.ModuloErrorModule);
        }),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
