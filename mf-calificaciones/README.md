# Microfrontend Calificaciones

Modulo remoto que consulta y resume las calificaciones del estudiante seleccionado en `mf-estudiantes`.

## Puerto e integracion

- URL local: `http://localhost:4203`
- Ruta dentro del shell: `/calificaciones`
- Remote entry: `http://localhost:4203/remoteEntry.js`
- Modulo expuesto: `./Module`
- Modulo Angular expuesto: `src/app/calificaciones/calificaciones.module.ts`

## Responsabilidades

- Escuchar el evento `estudiante.seleccionado` desde el EventBus del `shell`.
- Cargar datos desde `src/assets/data/calificaciones.json`.
- Filtrar calificaciones por `estudianteId`.
- Calcular promedio, aprobaciones, reprobaciones y distribucion de notas.

Payload esperado:

```ts
{
  id: number;
  nombre: string;
  codigo: string;
  carrera: string;
  semestre: number;
}
```

## Archivos clave

- `src/app/calificaciones/calificaciones.component.ts`
- `src/app/calificaciones/calificaciones-routing.module.ts`
- `src/app/services/event-bus-loader.service.ts`
- `src/assets/data/calificaciones.json`
- `webpack.config.js`

## Comandos

```bash
npm install
npm start
npm run build
npm test
```

Los comandos se ejecutan desde la carpeta `mf-calificaciones`. Para ver datos filtrados, primero seleccionar un estudiante desde `/estudiantes` en el shell.
