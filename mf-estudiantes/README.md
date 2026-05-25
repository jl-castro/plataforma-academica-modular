# Microfrontend Estudiantes

Modulo remoto encargado de listar estudiantes, permitir busqueda y filtros, mostrar el perfil del seleccionado y emitir el evento que sincroniza a los demas microfrontends.

## Puerto e integracion

- URL local: `http://localhost:4201`
- Ruta dentro del shell: `/estudiantes`
- Remote entry: `http://localhost:4201/remoteEntry.js`
- Modulo expuesto: `./Module`
- Modulo Angular expuesto: `src/app/estudiantes/estudiantes.module.ts`

## Responsabilidades

- Cargar datos desde `src/assets/data/estudiantes.json`.
- Busqueda por nombre o codigo; filtros por carrera y semestre.
- Panel lateral de perfil (avatar, correo, carrera, semestre) al seleccionar un estudiante.
- Metricas: total de registros, carreras, semestre promedio y contador de resultados filtrados.
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

## Modo independiente

Funciona de forma autonoma en `http://localhost:4201` con datos JSON locales. Importa estilos desde `shared/styles/_pam-base.scss`.

## Archivos clave

- `src/app/estudiantes/estudiantes.component.ts`
- `src/app/estudiantes/estudiantes-routing.module.ts`
- `src/app/services/event-bus-loader.service.ts`
- `src/assets/data/estudiantes.json`
- `src/styles.scss` (importa `pam-base`)
- `webpack.config.js`

## Comandos

```bash
npm install
npm start
npm run build
npm test
```

Los comandos se ejecutan desde la carpeta `mf-estudiantes`. Para probar la emision del evento dentro de la plataforma, el `shell` debe estar activo en `http://localhost:4200`.
