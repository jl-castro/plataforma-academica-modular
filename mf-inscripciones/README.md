# Microfrontend Inscripciones

Modulo remoto que muestra las materias inscritas para el estudiante seleccionado en `mf-estudiantes`, con vista de carga de creditos, calendario semanal y filtros por estado.

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
- Barra de progreso de creditos inscritos (max. 30).
- Chips de filtro por estado: Todos, Inscrito, Pendiente, Retirado.
- Calendario semanal generado a partir del texto de horario de cada materia.
- Barras horizontales de creditos por materia y tabla de detalle.

Payload esperado:

```ts
{
  id: number;
  nombre: string;
  codigo: string;
  carrera: string;
}
```

## Modo independiente

En `http://localhost:4202`, si no llega `estudiante.seleccionado` en ~600 ms, carga el perfil de demostracion definido en `shared/demo/estudiante-demo.ts` (Ana Lucía, id `1`). Muestra un banner indicando vista demo. **No emite eventos** en ese modo; el contrato del EventBus en el shell no cambia.

## Archivos clave

- `src/app/inscripciones/inscripciones.component.ts`
- `src/app/inscripciones/inscripciones-routing.module.ts`
- `src/app/services/event-bus-loader.service.ts`
- `src/assets/data/inscripciones.json`
- `shared/demo/estudiante-demo.ts`
- `shared/runtime/modo-independiente.ts`
- `webpack.config.js`

## Comandos

```bash
npm install
npm start
npm run build
npm test
```

Desde el shell: seleccionar un estudiante en `/estudiantes` antes de abrir `/inscripciones`. En standalone: abrir `http://localhost:4202` y esperar la carga demo.
