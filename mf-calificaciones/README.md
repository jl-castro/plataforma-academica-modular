# Microfrontend Calificaciones

Modulo remoto que consulta y resume las calificaciones del estudiante seleccionado en `mf-estudiantes`, con promedio destacado, graficos por materia y filas expandibles.

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
- Hero con promedio general y umbral de color segun rendimiento.
- Grafico de barras agrupadas por materia (1er parcial, 2do parcial, examen final).
- Filas expandibles en la tabla de detalle.
- Totales, aprobaciones, reprobaciones y distribucion de notas.

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

## Modo independiente

En `http://localhost:4203`, si no llega `estudiante.seleccionado` en ~600 ms, carga el perfil de demostracion de `shared/demo/estudiante-demo.ts`. Muestra banner de vista demo. **No emite eventos** en ese modo.

## Archivos clave

- `src/app/calificaciones/calificaciones.component.ts`
- `src/app/calificaciones/calificaciones-routing.module.ts`
- `src/app/services/event-bus-loader.service.ts`
- `src/assets/data/calificaciones.json`
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

Desde el shell: seleccionar un estudiante en `/estudiantes` antes de abrir `/calificaciones`. En standalone: abrir `http://localhost:4203` y esperar la carga demo.
