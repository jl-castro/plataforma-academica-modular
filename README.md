# Plataforma Academica Modular

Proyecto academico construido con Angular y Module Federation. La aplicacion esta organizada como una plataforma modular: un contenedor principal o `shell` carga microfrontends independientes para estudiantes, inscripciones, calificaciones y dashboard.

## Objetivo

La plataforma demuestra una arquitectura de microfrontends aplicada a un sistema academico. Cada modulo puede desarrollarse, ejecutarse y desplegarse de forma independiente, mientras el `shell` centraliza la navegacion, la carga dinamica, el monitoreo de disponibilidad y la comunicacion entre modulos.

## Arquitectura general

```text
plataforma-academica-modular/
|-- shell/                # Aplicacion contenedora
|-- mf-estudiantes/       # Gestion y seleccion de estudiantes
|-- mf-inscripciones/     # Consulta de materias inscritas por estudiante
|-- mf-calificaciones/    # Consulta de calificaciones por estudiante
|-- mf-dashboard/         # Resumen estadistico general
`-- start-all.bat         # Script local para levantar varios servicios
```

El `shell` carga los modulos remotos mediante `@angular-architects/module-federation`. La configuracion principal de remotos vive en:

- `shell/src/app/app-routing.module.ts`
- `shell/src/assets/manifest.json`
- `shell/webpack.config.js`

## Modulos y puertos

| Aplicacion | Puerto | Ruta en shell | Remote entry | Modulo expuesto | Estado en manifest |
| --- | ---: | --- | --- | --- | --- |
| `shell` | 4200 | `/` | `http://localhost:4200/remoteEntry.js` | `./EventBusService` | Host |
| `mf-estudiantes` | 4201 | `/estudiantes` | `http://localhost:4201/remoteEntry.js` | `./Module` | `activo` |
| `mf-inscripciones` | 4202 | `/inscripciones` | `http://localhost:4202/remoteEntry.js` | `./Module` | `activo` |
| `mf-calificaciones` | 4203 | `/calificaciones` | `http://localhost:4203/remoteEntry.js` | `./Module` | `activo` |
| `mf-dashboard` | 4204 | `/dashboard` | `http://localhost:4204/remoteEntry.js` | `./Module` | `inactivo` |

## Tecnologias principales

- Angular 20
- TypeScript 5.8
- RxJS 7.8
- Module Federation con `@angular-architects/module-federation`
- `ngx-build-plus`
- `lucide-angular` para iconografia
- Karma/Jasmine para pruebas unitarias

## Requisitos

- Node.js compatible con Angular 20
- npm
- Angular CLI, opcional si se usa `npx ng`

Cada aplicacion tiene su propio `package.json` y su propio `package-lock.json`, por lo que las dependencias se instalan por carpeta.

## Instalacion

Desde la raiz del repositorio:

```bash
cd shell && npm install
cd ../mf-estudiantes && npm install
cd ../mf-inscripciones && npm install
cd ../mf-calificaciones && npm install
cd ../mf-dashboard && npm install
```

## Ejecucion local

Opcion manual, en terminales separadas:

```bash
cd shell && npm start
cd mf-estudiantes && npm start
cd mf-inscripciones && npm start
cd mf-calificaciones && npm start
cd mf-dashboard && npm start
```

Luego abrir:

```text
http://localhost:4200
```

Opcion con script:

```bash
start-all.bat
```

Nota: el script actual inicia `shell`, `mf-estudiantes`, `mf-inscripciones` y `mf-calificaciones`. El modulo `mf-dashboard` esta configurado en el proyecto, pero debe iniciarse manualmente con `cd mf-dashboard && npm start` si se desea usar `/dashboard`.

## Funcionalidad por modulo

### Shell

Responsabilidades principales:

- Renderiza la estructura general de la plataforma.
- Muestra la navegacion de modulos activos segun `assets/manifest.json`.
- Carga microfrontends por rutas lazy.
- Expone `EventBusService` para comunicacion entre aplicaciones.
- Monitorea el estado de los remotos haciendo `HEAD` al `remoteEntry.js`.
- Redirige a una pantalla de error cuando un modulo esta fuera de linea.
- Muestra una consola de arquitectura con eventos emitidos, recibidos y errores.

### Estudiantes

Responsabilidades:

- Carga estudiantes desde `mf-estudiantes/src/assets/data/estudiantes.json`.
- Muestra metricas como total de carreras y semestre promedio.
- Permite seleccionar un estudiante.
- Emite el evento `estudiante.seleccionado` mediante el EventBus del `shell`.

Payload principal:

```ts
{
  id: number;
  nombre: string;
  codigo: string;
  carrera: string;
  semestre: number;
}
```

### Inscripciones

Responsabilidades:

- Escucha el evento `estudiante.seleccionado`.
- Carga datos desde `mf-inscripciones/src/assets/data/inscripciones.json`.
- Filtra inscripciones por `estudianteId`.
- Calcula creditos totales y estados de materias.

### Calificaciones

Responsabilidades:

- Escucha el evento `estudiante.seleccionado`.
- Carga datos desde `mf-calificaciones/src/assets/data/calificaciones.json`.
- Filtra calificaciones por estudiante.
- Calcula totales, aprobaciones, reprobaciones y distribucion de notas.

### Dashboard

Responsabilidades:

- Carga resumen estadistico desde `http://localhost:4204/assets/data/dashboard.json`.
- Presenta informacion general de la plataforma academica.
- Esta configurado en rutas y Module Federation, pero actualmente figura como `inactivo` en `shell/src/assets/manifest.json`, por lo que no aparece en la navegacion principal.

## Eventos de integracion

| Evento | Emitido por | Escuchado por | Proposito |
| --- | --- | --- | --- |
| `estudiante.seleccionado` | `mf-estudiantes` | `mf-inscripciones`, `mf-calificaciones` | Sincronizar el estudiante activo entre modulos |
| `modulo.cargado` | `shell` | Consola de arquitectura | Registrar carga correcta de un modulo |
| `modulo.error` | `shell` | Consola de arquitectura | Registrar fallo al cargar un modulo remoto |
| `modulo.desconectado` | `shell` | Consola de arquitectura | Registrar que un remoto dejo de responder |
| `modulo.reconectado` | `shell` | Consola de arquitectura | Registrar que un remoto volvio a estar disponible |

## Comandos utiles

Ejecutar una aplicacion:

```bash
npm start
```

Construir una aplicacion:

```bash
npm run build
```

Ejecutar pruebas:

```bash
npm test
```

Estos comandos se ejecutan dentro de cada carpeta (`shell`, `mf-estudiantes`, etc.).

## Documentacion adicional

- [Arquitectura](docs/ARQUITECTURA.md)
- [Desarrollo y mantenimiento](docs/DESARROLLO.md)
