# Microfrontend Estudiantes

Modulo remoto encargado de listar estudiantes, mostrar metricas basicas y emitir el evento de seleccion que sincroniza a los demas microfrontends.

## Puerto e integracion

- URL local: `http://localhost:4201`
- Ruta dentro del shell: `/estudiantes`
- Remote entry: `http://localhost:4201/remoteEntry.js`
- Modulo expuesto: `./Module`
- Modulo Angular expuesto: `src/app/estudiantes/estudiantes.module.ts`

## Responsabilidades

- Cargar datos desde `src/assets/data/estudiantes.json`.
- Mostrar total de estudiantes, carreras y semestre promedio.
- Permitir seleccionar un estudiante.
- Emitir `estudiante.seleccionado` usando el EventBus remoto del `shell`.

Payload emitido:

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

- `src/app/estudiantes/estudiantes.component.ts`
- `src/app/estudiantes/estudiantes-routing.module.ts`
- `src/app/services/event-bus-loader.service.ts`
- `src/assets/data/estudiantes.json`
- `webpack.config.js`

## Comandos

```bash
npm install
npm start
npm run build
npm test
```

Los comandos se ejecutan desde la carpeta `mf-estudiantes`. Para probar la emision del evento dentro de la plataforma, el `shell` debe estar activo en `http://localhost:4200`.
