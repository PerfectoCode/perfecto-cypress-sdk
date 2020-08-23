#!/usr/bin/env node
import yargs from 'yargs';

// noinspection BadExpressionStatementJS
yargs
  .parserConfiguration({'camel-case-expansion': false})
  .demandCommand(1, 'You need at least one command before moving on')

  .commandDir('cmds', {extensions: ['cmd.js']})

  .version()
  .help()
  .argv;
