const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  remotes: {
    "mf-estudiantes": "mf-estudiantes@http://localhost:4201/remoteEntry.js",
    "mf-inscripciones": "mf-inscripciones@http://localhost:4202/remoteEntry.js",
    "mf-calificaciones": "mf-calificaciones@http://localhost:4203/remoteEntry.js",
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
