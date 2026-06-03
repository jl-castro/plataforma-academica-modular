# Microfrontend Dashboard

Modulo remoto con resumen estadistico general de la plataforma academica. En el manifest del shell figura como `inactivo` durante la demo de sustentacion; para uso diario, cambiar a `activo` (ver `docs/DEMO.md`).

## Puerto e integracion

- URL local: `http://localhost:4204`
- Ruta dentro del shell: `/dashboard`
- Remote entry: `http://localhost:4204/remoteEntry.js`
- Modulo expuesto: `./Module`
- Modulo Angular expuesto: `src/app/dashboard/dashboard.module.ts`

## Arranque con start-all.bat

El script `start-all.bat` no inicia este modulo automaticamente. Para usarlo desde el shell:

```bash
cd mf-dashboard
npm start
```

Tambien puede abrirse en modo independiente en `http://localhost:4204` sin el shell.

## Responsabilidades

- Importar resumen desde `src/assets/data/dashboard.json` en tiempo de compilacion (no via HTTP), para que funcione embebido en el shell y en standalone.
- Agregar materias con mayor demanda importando `mf-inscripciones/src/assets/data/inscripciones.json` en build time.
- KPIs con iconos Lucide, grafico por carrera, top de materias inscritas, distribucion por semestre y estado de modulos.
- No consume eventos del EventBus; opera de forma autonoma.

## Archivos clave

- `src/app/dashboard/dashboard.component.ts`
- `src/app/dashboard/dashboard-routing.module.ts`
- `src/assets/data/dashboard.json`
- `src/styles.scss` (importa `pam-base`)
- `webpack.config.js`

## Comandos

```bash
npm install
npm start
npm run build
npm test
```

Los comandos se ejecutan desde la carpeta `mf-dashboard`.
