const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'mf-inscripciones',

  remotes: {
    shell: 'shell@http://localhost:4200/remoteEntry.js',
  },

  exposes: {
    './Module': './src/app/inscripciones/inscripciones.module.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
