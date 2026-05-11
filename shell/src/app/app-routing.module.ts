import { APP_INITIALIZER, NgModule, Provider } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  NavigationEnd,
  RouteConfigLoadEnd,
  RouteReuseStrategy,
  Router,
  RouterModule,
  Routes,
} from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { filter } from 'rxjs';

const failedModulos = new Set<string>();
const modulos = ['estudiantes', 'inscripciones', 'calificaciones', 'dashboard'] as const;
type Modulo = (typeof modulos)[number];
type RemoteModuloConfig = {
  remoteEntry: string;
  exposedModule: string;
  ngModuleName: string;
};
type CachedLazyRoute = Routes[number] & {
  _loadedRoutes?: Routes;
  _loadedInjector?: unknown;
  _loadedNgModuleFactory?: unknown;
};

const remoteModulos: Record<Modulo, RemoteModuloConfig> = {
  estudiantes: {
    remoteEntry: 'http://localhost:4201/remoteEntry.js',
    exposedModule: './Module',
    ngModuleName: 'EstudiantesModule',
  },
  inscripciones: {
    remoteEntry: 'http://localhost:4202/remoteEntry.js',
    exposedModule: './Module',
    ngModuleName: 'InscripcionesModule',
  },
  calificaciones: {
    remoteEntry: 'http://localhost:4203/remoteEntry.js',
    exposedModule: './Module',
    ngModuleName: 'CalificacionesModule',
  },
  dashboard: {
    remoteEntry: 'http://localhost:4204/remoteEntry.js',
    exposedModule: './Module',
    ngModuleName: 'DashboardModule',
  },
};

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

function isModulo(path: string | undefined): path is Modulo {
  return modulos.includes(path as Modulo);
}

function clearLazyRouteCache(route: CachedLazyRoute): void {
  delete route._loadedRoutes;
  delete route._loadedInjector;
  delete route._loadedNgModuleFactory;
}

function clearModuloRouteCache(modulo: Modulo, loadedRoute?: CachedLazyRoute): void {
  const route = loadedRoute ?? routes.find((route) => route.path === modulo) as CachedLazyRoute | undefined;

  if (!route) {
    return;
  }

  clearLazyRouteCache(route);
}

function loadModuloErrorModule(modulo: Modulo) {
  return import('./modulo-error/modulo-error.module').then((m) => {
    return m.ModuloErrorModule;
  });
}

function remoteEntryForAttempt(modulo: Modulo): string {
  const remoteEntry = remoteModulos[modulo].remoteEntry;

  if (!failedModulos.has(modulo)) {
    return remoteEntry;
  }

  const separator = remoteEntry.includes('?') ? '&' : '?';
  return `${remoteEntry}${separator}pamRetry=${Date.now()}`;
}

function loadModulo(modulo: Modulo) {
  const config = remoteModulos[modulo];

  return loadRemoteModule({
    type: 'module',
    remoteEntry: remoteEntryForAttempt(modulo),
    exposedModule: config.exposedModule,
  })
    .then((m) => {
      failedModulos.delete(modulo);
      return m[config.ngModuleName];
    })
    .catch((err) => {
      failedModulos.add(modulo);
      emitModuloError(modulo, err);
      return loadModuloErrorModule(modulo);
    });
}

export function pamModuloCargadoListenerFactory(router: Router): () => Promise<void> {
  return () => {
    router.events
      .pipe(filter((event): event is RouteConfigLoadEnd => event instanceof RouteConfigLoadEnd))
      .subscribe((event) => {
        const path = event.route.path;

        if (isModulo(path) && failedModulos.has(path)) {
          setTimeout(() => clearModuloRouteCache(path, event.route as CachedLazyRoute));
        }
      });

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

export class NoCacheRouteReuseStrategy implements RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean { return false; }
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {}
  shouldAttach(route: ActivatedRouteSnapshot): boolean { return false; }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null { return null; }
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}

const routes: Routes = [
  { path: '', redirectTo: '/estudiantes', pathMatch: 'full' },
  {
    path: 'estudiantes',
    loadChildren: () => loadModulo('estudiantes'),
  },
  {
    path: 'inscripciones',
    loadChildren: () => loadModulo('inscripciones'),
  },
  {
    path: 'calificaciones',
    loadChildren: () => loadModulo('calificaciones'),
  },
  {
    path: 'dashboard',
    loadChildren: () => loadModulo('dashboard'),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
