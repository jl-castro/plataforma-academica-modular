const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'shell',

  remotes: {
    "mf-estudiantes":    "mf-estudiantes@http://localhost:4201/remoteEntry.js",
    "mf-inscripciones":  "mf-inscripciones@http://localhost:4202/remoteEntry.js",
    "mf-calificaciones": "mf-calificaciones@http://localhost:4203/remoteEntry.js",
  },

  exposes: {
    './EventBusService': './src/app/services/event-bus.service.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
