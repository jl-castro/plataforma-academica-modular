const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'mf-calificaciones',

  remotes: {
    shell: 'shell@http://localhost:4200/remoteEntry.js',
  },

  exposes: {
    './Module': './src/app/calificaciones/calificaciones.module.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
