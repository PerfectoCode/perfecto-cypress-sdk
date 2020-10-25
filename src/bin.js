#!/usr/bin/env node
import * as yargs from 'yargs';
import './common/on-exit';

// noinspection BadExpressionStatementJS
yargs
  .parserConfiguration({'camel-case-expansion': false})
  .demandCommand(1, 'You need at least one command before moving on')

  .commandDir('cmds', {extensions: ['cmd.js']})
  .strictCommands()
  .showHelpOnFail(false, 'Specify --help for available options')
  .version()
  .help()
  .argv;
