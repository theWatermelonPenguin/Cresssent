#!/usr/bin/env node
const path = require('path');

const args = process.argv.slice(2);
const [command, subcommand] = args;

if (!command) {
  console.log('Usage: crsnt <command> [subcommand]');
  process.exit(1);
}

if (command === 'create') {
  if (subcommand === 'env') {
    require(path.resolve(__dirname, 'commands', 'crsnt-create-env.js'));
  } else if (subcommand === 'project') {
    require(path.resolve(__dirname, 'commands', 'crsnt-create-project.js'));
  } else {
    console.error(`Unknown create subcommand: ${subcommand}`);
  }
} else if (command === 'config') {
  require(path.resolve(__dirname, 'commands', 'crsnt-config.js'));
} else if (command === 'delete') {
  require(path.resolve(__dirname, 'commands', 'crsnt-delete.js'))(subcommand);
} else if (command === 'help') {
  require(path.resolve(__dirname, 'commands', 'crsnt-help.js'));
} else if (command === '--version' || command === '-v') {
  require(path.resolve(__dirname, 'commands', 'crsnt-version.js'));
} else if (command === 'run') {
  require(path.resolve(__dirname, 'commands', 'crsnt-run.js'))(args.slice(1));
}


else {
  console.error(`Unknown command: ${command}`);
}
