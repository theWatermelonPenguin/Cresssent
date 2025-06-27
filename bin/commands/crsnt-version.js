function showVersion() {
  const pkg = require('../../package.json');
  console.log(`Cresssent version: ${pkg.version}`);
};
showVersion();