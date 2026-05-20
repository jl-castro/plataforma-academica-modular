# Microfrontend Inscripciones

Modulo remoto que muestra las materias inscritas para el estudiante seleccionado en `mf-estudiantes`.

## Puerto e integracion

- URL local: `http://localhost:4202`
- Ruta dentro del shell: `/inscripciones`
- Remote entry: `http://localhost:4202/remoteEntry.js`
- Modulo expuesto: `./Module`
- Modulo Angular expuesto: `src/app/inscripciones/inscripciones.module.ts`

## Responsabilidades

- Escuchar el evento `estudiante.seleccionado` desde el EventBus del `shell`.
- Cargar datos desde `src/assets/data/inscripciones.json`.
- Filtrar inscripciones por `estudianteId`.
- Calcular creditos totales, materias inscritas y materias pendientes.

Payload esperado:

```ts
{
  id: number;
  nombre: string;
  codigo: string;
  carrera: string;
}
```

## Archivos clave

- `src/app/inscripciones/inscripciones.component.ts`
- `src/app/inscripciones/inscripciones-routing.module.ts`
- `src/app/services/event-bus-loader.service.ts`
- `src/assets/data/inscripciones.json`
- `webpack.config.js`

## Comandos

```bash
npm install
npm start
npm run build
npm test
```

Los comandos se ejecutan desde la carpeta `mf-inscripciones`. Para ver datos filtrados, primero seleccionar un estudiante desde `/estudiantes` en el shell.
