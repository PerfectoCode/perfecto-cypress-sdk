#!/usr/bin/env node
import yargs from 'yargs';

// noinspection BadExpressionStatementJS
yargs
  .demandCommand(1, 'You need at least one command before moving on')

  .commandDir('cmds', {extensions: ['cmd.js']})

  .version()
  .help()
  .argv;
