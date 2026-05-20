# Desarrollo y mantenimiento

## Estructura de proyectos

Cada carpeta principal es una aplicacion Angular independiente:

```text
shell/
mf-estudiantes/
mf-inscripciones/
mf-calificaciones/
mf-dashboard/
```

Cada aplicacion contiene:

- `package.json`: scripts y dependencias.
- `angular.json`: configuracion Angular y puerto de desarrollo.
- `webpack.config.js`: configuracion Module Federation para desarrollo.
- `webpack.prod.config.js`: configuracion Module Federation para produccion.
- `src/app`: componentes, modulos, rutas y servicios.
- `src/assets/data`: datos JSON de demostracion, cuando aplica.

## Instalacion limpia

Ejecutar `npm install` en cada proyecto:

```bash
cd shell
npm install

cd ../mf-estudiantes
npm install

cd ../mf-inscripciones
npm install

cd ../mf-calificaciones
npm install

cd ../mf-dashboard
npm install
```

## Levantar ambiente local

Abrir una terminal por aplicacion:

```bash
cd shell
npm start
```

```bash
cd mf-estudiantes
npm start
```

```bash
cd mf-inscripciones
npm start
```

```bash
cd mf-calificaciones
npm start
```

```bash
cd mf-dashboard
npm start
```

URLs:

| Aplicacion | URL |
| --- | --- |
| Shell | `http://localhost:4200` |
| Estudiantes | `http://localhost:4201` |
| Inscripciones | `http://localhost:4202` |
| Calificaciones | `http://localhost:4203` |
| Dashboard | `http://localhost:4204` |

## Build

Construir cada aplicacion desde su carpeta:

```bash
npm run build
```

Los artefactos se generan bajo `dist/<nombre-app>`.

## Pruebas

Ejecutar pruebas unitarias desde la carpeta de cada aplicacion:

```bash
npm test
```

El proyecto usa Karma y Jasmine.

## Agregar un nuevo microfrontend

Pasos recomendados:

1. Crear la aplicacion Angular del nuevo modulo.
2. Configurar Module Federation para exponer `./Module`.
3. Asignar un puerto libre en `angular.json`.
4. Agregar el remoto en `shell/webpack.config.js`.
5. Agregar la configuracion de carga en `shell/src/app/app-routing.module.ts`.
6. Agregar la entrada en `shell/src/assets/manifest.json`.
7. Si el modulo escucha eventos, crear un `EventBusLoaderService` similar al de `mf-inscripciones` o `mf-calificaciones`.
8. Si el modulo emite eventos, documentar el payload en el manifest y en esta documentacion.

Ejemplo de entrada en el manifest:

```json
{
  "nuevo-modulo": {
    "id": "nuevo-modulo",
    "nombre": "Nuevo modulo",
    "remoteEntry": "http://localhost:4205/remoteEntry.js",
    "exposedModule": "./Module",
    "ruta": "/nuevo-modulo",
    "version": "1.0.0",
    "eventosEmitidos": [],
    "eventosEscuchados": [],
    "estado": "activo"
  }
}
```

## Agregar un evento entre modulos

1. Definir un nombre claro, por ejemplo `materia.seleccionada`.
2. Emitir el evento desde el modulo origen:

```ts
bus.emit('materia.seleccionada', payload);
```

3. Escucharlo desde el modulo destino:

```ts
bus.on('materia.seleccionada').subscribe((payload) => {
  // reaccionar al evento
});
```

4. Registrar el evento en `shell/src/assets/manifest.json`.
5. Actualizar la tabla de eventos en `README.md`.

## Convenciones del proyecto

- Mantener cada funcionalidad dentro de su microfrontend.
- Evitar importar directamente codigo de otro microfrontend de negocio.
- Usar eventos para comunicacion transversal.
- Mantener el `shell` como orquestador, no como modulo de negocio.
- Mantener sincronizados puertos, rutas y `remoteEntry`.
- Documentar todo nuevo evento con su payload.
- Usar datos JSON locales solo para demostracion o prototipado.

## Solucion de problemas

### El shell muestra error al abrir un modulo

Verificar que el microfrontend este levantado y que su `remoteEntry.js` responda:

```text
http://localhost:<puerto>/remoteEntry.js
```

Ejemplo:

```text
http://localhost:4201/remoteEntry.js
```

### Un modulo aparece offline

El servicio de salud del `shell` hace una peticion `HEAD` al `remoteEntry.js`. Revisar:

- Que el servidor del microfrontend este activo.
- Que el puerto sea correcto.
- Que no exista un bloqueo por navegador o red.
- Que el manifest tenga la URL correcta.

### Inscripciones o calificaciones no muestran datos

Primero seleccionar un estudiante en `/estudiantes`. Esos modulos dependen del evento `estudiante.seleccionado` para filtrar la informacion.

### Cambie un puerto y dejo de cargar el remoto

Actualizar el puerto en todos estos lugares:

- `angular.json` del microfrontend.
- `shell/src/assets/manifest.json`.
- `shell/src/app/app-routing.module.ts`.
- `shell/webpack.config.js`.
- `EventBusLoaderService`, si el cambio afecta al `shell`.

### El dashboard no carga con `start-all.bat`

El script actual no inicia `mf-dashboard` y el manifest lo mantiene con `estado: "inactivo"`, por lo que no aparece en la navegacion principal. Levantarlo manualmente:

```bash
cd mf-dashboard
npm start
```

Si se desea mostrarlo en la navegacion, cambiar su estado a `activo` en `shell/src/assets/manifest.json`.

## Checklist antes de entregar cambios

- La aplicacion afectada compila con `npm run build`.
- Los modulos remotos cargan desde el `shell`.
- El manifest esta actualizado.
- Los eventos nuevos estan documentados.
- No se introdujeron dependencias compartidas duplicadas sin necesidad.
- Los datos JSON usados por la vista existen y tienen la estructura esperada.
