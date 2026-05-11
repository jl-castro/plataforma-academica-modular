const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'mf-estudiantes',

  remotes: {
    shell: 'shell@http://localhost:4200/remoteEntry.js',
  },

  exposes: {
    './Module': './src/app/estudiantes/estudiantes.module.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
