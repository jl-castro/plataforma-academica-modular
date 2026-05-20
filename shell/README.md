# Shell

Aplicacion contenedora de la Plataforma Academica Modular. Expone la navegacion principal, carga los microfrontends remotos con Module Federation, monitorea su disponibilidad y publica el `EventBusService` usado para la comunicacion entre modulos.

## Puerto y rutas

- URL local: `http://localhost:4200`
- Ruta inicial: `/estudiantes`
- Remote entry expuesto: `http://localhost:4200/remoteEntry.js`
- Modulo expuesto: `./EventBusService`

## Responsabilidades

- Cargar `mf-estudiantes`, `mf-inscripciones`, `mf-calificaciones` y `mf-dashboard` mediante rutas lazy.
- Leer `src/assets/manifest.json` para mostrar modulos activos y registrar remotos.
- Verificar salud de remotos con peticiones `HEAD` a cada `remoteEntry.js`.
- Redirigir a `ModuloErrorModule` cuando un remoto esta fuera de linea o falla al cargar.
- Registrar eventos de arquitectura en la consola interna.

## Archivos clave

- `src/app/app-routing.module.ts`: rutas y carga dinamica de remotos.
- `src/app/services/event-bus.service.ts`: bus de eventos compartido.
- `src/app/services/manifest.service.ts`: lectura del manifest.
- `src/app/services/microfrontend-health.service.ts`: monitoreo de disponibilidad.
- `src/app/guards/modulo-health.guard.ts`: bloqueo de navegacion a remotos offline.
- `src/assets/manifest.json`: catalogo de microfrontends.
- `webpack.config.js`: remotos declarados y exposicion del EventBus.

## Comandos

```bash
npm install
npm start
npm run build
npm test
```

Los comandos se ejecutan desde la carpeta `shell`.

## Dependencias locales

Para probar la plataforma completa, levantar tambien los microfrontends remotos en sus puertos correspondientes:

| Microfrontend | Puerto |
| --- | ---: |
| `mf-estudiantes` | 4201 |
| `mf-inscripciones` | 4202 |
| `mf-calificaciones` | 4203 |
| `mf-dashboard` | 4204 |
