#!/usr/bin/env node --harmony
var co = require('co'),
    prompt = require('co-prompt'),
    mlnckMern = require('commander');

mlnckMern
  .arguments('<command>')
  .option('-n, --name <name>', 'The Project\'s Name')
  .option('-s, --sample <sample>', 'Install Sample Files')
  .action(function(sample) {
    co(function *() {
      var name = yield prompt('project name: '),
          sample = yield prompt.password('Install Sample Files: ');
      console.log('%s -> creating: %s: installing files?: %s', command, name, sample);
    });
  })
  .parse(process.argv);
