# Microfrontend Dashboard

Modulo remoto con un resumen estadistico general de la plataforma academica.

## Puerto e integracion

- URL local: `http://localhost:4204`
- Ruta dentro del shell: `/dashboard`
- Remote entry: `http://localhost:4204/remoteEntry.js`
- Modulo expuesto: `./Module`
- Modulo Angular expuesto: `src/app/dashboard/dashboard.module.ts`

## Estado actual

El modulo esta configurado en rutas, Module Federation y manifest, pero en `shell/src/assets/manifest.json` figura con `estado: "inactivo"`. Por eso no aparece en la navegacion principal aunque la ruta remota existe.

El script `start-all.bat` tampoco lo inicia automaticamente. Para usarlo, levantarlo manualmente:

```bash
cd mf-dashboard
npm start
```

## Responsabilidades

- Cargar datos desde `http://localhost:4204/assets/data/dashboard.json`.
- Mostrar estadisticas generales de estudiantes, inscripciones y rendimiento.
- Funcionar como modulo independiente sin consumir eventos del EventBus.

## Archivos clave

- `src/app/dashboard/dashboard.component.ts`
- `src/app/dashboard/dashboard-routing.module.ts`
- `src/assets/data/dashboard.json`
- `webpack.config.js`

## Comandos

```bash
npm install
npm start
npm run build
npm test
```

Los comandos se ejecutan desde la carpeta `mf-dashboard`.
