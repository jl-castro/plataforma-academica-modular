# Arquitectura

## Vision general

La Plataforma Academica Modular usa una arquitectura de microfrontends con Angular y Module Federation. El `shell` funciona como aplicacion host y cada microfrontend remoto encapsula una funcionalidad academica especifica.

El objetivo de esta separacion es permitir que los modulos evolucionen con bajo acoplamiento:

- Cada modulo tiene su propio proyecto Angular.
- Cada modulo define su propio `webpack.config.js`.
- Cada modulo expone un `NgModule` remoto mediante `./Module`.
- El `shell` decide que modulo cargar segun la ruta.
- La comunicacion transversal ocurre mediante eventos, no por referencias directas entre modulos de negocio.

## Diagrama logico

```text
                         +------------------+
                         |      shell       |
                         | localhost:4200   |
                         +--------+---------+
                                  |
         +------------------------+------------------------+
         |                        |                        |
         v                        v                        v
+-------------------+   +-------------------+   +-------------------+
| mf-estudiantes    |   | mf-inscripciones  |   | mf-calificaciones |
| localhost:4201    |   | localhost:4202    |   | localhost:4203    |
+---------+---------+   +---------^---------+   +---------^---------+
          |                       |                       |
          | estudiante.seleccionado                       |
          +-----------------------+-----------------------+
                                  |
                                  v
                    +-----------------------------+
                    | EventBus expuesto por shell |
                    +-----------------------------+

+-------------------+
| mf-dashboard      |
| localhost:4204    |
+-------------------+
```

## Shell

El `shell` es el punto de entrada funcional de la plataforma.

Archivos principales:

- `shell/src/app/app-routing.module.ts`
- `shell/src/app/app.module.ts`
- `shell/src/app/services/event-bus.service.ts`
- `shell/src/app/services/manifest.service.ts`
- `shell/src/app/services/microfrontend-health.service.ts`
- `shell/src/app/guards/modulo-health.guard.ts`
- `shell/src/assets/manifest.json`
- `shell/webpack.config.js`

### Carga remota

Las rutas del `shell` usan `loadRemoteModule` para descargar el `remoteEntry.js` de cada microfrontend y cargar el modulo Angular expuesto.

Ejemplo conceptual:

```ts
loadRemoteModule({
  type: 'module',
  remoteEntry: 'http://localhost:4201/remoteEntry.js',
  exposedModule: './Module',
});
```

Cada remoto devuelve su modulo Angular:

- `EstudiantesModule`
- `InscripcionesModule`
- `CalificacionesModule`
- `DashboardModule`

### Fallback de error

Si falla la carga de un modulo remoto, el `shell`:

1. Registra el modulo como fallido.
2. Emite `modulo.error`.
3. Carga `ModuloErrorModule`.
4. Limpia cache de rutas lazy en reintentos para permitir recuperacion.

### Monitoreo de salud

`MicrofrontendHealthService` lee el manifest, registra los modulos y verifica periodicamente cada `remoteEntry`.

La verificacion usa:

```ts
fetch(remoteEntry, { cache: 'no-store', method: 'HEAD' })
```

Estados posibles:

- `unknown`: todavia no se conoce el estado.
- `online`: el `remoteEntry` responde correctamente.
- `offline`: el `remoteEntry` no responde o devuelve error.

El guard `ModuloHealthGuard` impide navegar hacia modulos offline y redirige a la pantalla de error.

## Manifest

Archivo:

```text
shell/src/assets/manifest.json
```

Define los modulos disponibles para navegacion y monitoreo. Los modulos con `estado: "activo"` aparecen en la navegacion principal; los modulos `inactivo` pueden seguir configurados para rutas, pruebas o activacion posterior.

```json
{
  "estudiantes": {
    "id": "estudiantes",
    "nombre": "Estudiantes",
    "remoteEntry": "http://localhost:4201/remoteEntry.js",
    "exposedModule": "./Module",
    "ruta": "/estudiantes",
    "version": "1.0.0",
    "eventosEmitidos": ["estudiante.seleccionado"],
    "eventosEscuchados": [],
    "estado": "activo"
  }
}
```

Campos:

| Campo | Descripcion |
| --- | --- |
| `id` | Identificador interno del modulo |
| `nombre` | Nombre mostrado en navegacion |
| `remoteEntry` | URL del entry remoto de Module Federation |
| `exposedModule` | Alias del modulo expuesto por el remoto |
| `ruta` | Ruta usada por el shell |
| `version` | Version funcional del modulo |
| `eventosEmitidos` | Eventos publicados por el modulo |
| `eventosEscuchados` | Eventos consumidos por el modulo |
| `estado` | `activo`, `inactivo` o `error`; controla principalmente si el modulo aparece en navegacion |

## Module Federation

### Shell

El `shell` declara los remotos y expone el EventBus:

```js
remotes: {
  "mf-estudiantes": "mf-estudiantes@http://localhost:4201/remoteEntry.js",
  "mf-inscripciones": "mf-inscripciones@http://localhost:4202/remoteEntry.js",
  "mf-calificaciones": "mf-calificaciones@http://localhost:4203/remoteEntry.js",
  "mf-dashboard": "mf-dashboard@http://localhost:4204/remoteEntry.js",
},
exposes: {
  './EventBusService': './src/app/services/event-bus.service.ts',
}
```

### Microfrontends

Cada microfrontend expone su modulo funcional:

```js
exposes: {
  './Module': './src/app/<modulo>/<modulo>.module.ts',
}
```

Los modulos que necesitan comunicarse con otros consumen el EventBus remoto del `shell`:

```ts
loadRemoteModule({
  type: 'module',
  remoteEntry: 'http://localhost:4200/remoteEntry.js',
  exposedModule: './EventBusService',
});
```

## EventBus

Archivo:

```text
shell/src/app/services/event-bus.service.ts
```

El bus usa `BehaviorSubject` por nombre de evento y mantiene una lista de logs consultada por la consola de arquitectura.

Metodos principales:

| Metodo | Funcion |
| --- | --- |
| `emit(evento, payload)` | Publica un evento y registra log como `emitido` |
| `on(evento)` | Retorna un observable para escuchar payloads |
| `log(evento, payload, direction)` | Registra eventos manuales como `emitido`, `recibido` o `error` |
| `getLogs()` | Devuelve los logs acumulados |
| `clearLogs()` | Limpia la consola de eventos |

## Flujo principal de seleccion de estudiante

1. El usuario abre `http://localhost:4200/estudiantes`.
2. `mf-estudiantes` carga datos desde `assets/data/estudiantes.json`.
3. El usuario selecciona un estudiante.
4. `mf-estudiantes` emite `estudiante.seleccionado`.
5. `mf-inscripciones` recibe el evento y filtra materias por `estudianteId`.
6. `mf-calificaciones` recibe el evento y filtra notas por `estudianteId`.
7. La consola de arquitectura muestra eventos emitidos y recibidos.

## Datos locales

Los datos de demostracion viven en archivos JSON dentro de cada microfrontend:

| Modulo | Archivo |
| --- | --- |
| Estudiantes | `mf-estudiantes/src/assets/data/estudiantes.json` |
| Inscripciones | `mf-inscripciones/src/assets/data/inscripciones.json` |
| Calificaciones | `mf-calificaciones/src/assets/data/calificaciones.json` |
| Dashboard | `mf-dashboard/src/assets/data/dashboard.json` |

## Consideraciones tecnicas

- Los microfrontends dependen del `shell` para usar el EventBus.
- `mf-inscripciones` y `mf-calificaciones` deben recibir un evento de estudiante antes de mostrar datos filtrados.
- Las rutas del `shell` y el `manifest.json` deben mantenerse sincronizados.
- Si cambia un puerto, deben actualizarse el `angular.json`, el `manifest`, el `app-routing.module.ts` del shell y las referencias de Module Federation.
- `shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' })` evita duplicar dependencias compartidas de Angular entre host y remotos.
