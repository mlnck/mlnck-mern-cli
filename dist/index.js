#!/usr/bin/env node --harmony
var co = require('co'),
    prompt = require('co-prompt'),
    mlnckMern = require('commander');

mlnckMern
  .version('0.0.1');

mlnckMern
  .command('create-project')
  .alias('create')
  .description('create new mlnck-mern project')
  .arguments('<project-name> [install-sample]')
  .option('-i --install-sample <sample>', 'install sample project', /^(yes|no)$/i, 'yes')
  .action(function(projectName){
    co(function *() {
      var sample = yield prompt('install sample project (yes): '),
      sample = (sample.length) ? sample : 'yes';
      console.log('creating/setup for project named %s', projectName);
      console.log('   with sample: %s', sample);
    });
  });

mlnckMern
  .command('remove-sample')
  .alias('remove')
  .description('remove smaple files and logs which may have been initially installed')
  .action(function(name){
    co(function *() {
      var bool = yield prompt.confirm('remove sample files: ');
      console.log('removing files:',bool);
    });
  });

mlnckMern
  .command('include-optional')
  .alias('optional')
  .description('include optional components')
  .action(function(name){
    co(function *() {
      var bool = yield prompt.confirm('include optional files: ');
      console.log('including files:',bool);
    });
  });

mlnckMern
  .command('create-component')
  .alias('component')
  .description('create client side component and associated files')
  .arguments('<name> [stateful] [dispatch] [saga] [styled] [tests]')
  .option('-sta --stateful <stateful>', 'will this be a stateful component', /^(yes|no)$/i, 'yes')
  .option('-r --add-route <route>', 'create route', /^(yes|no)$/i, 'yes')
  .option('-d --dispatch <dispatch>', 'will this component dispatch actions', /^(yes|no)$/i, 'no')
  .option('-sa --saga <saga>', 'will this component need have side-effects', /^(yes|no)$/i, 'no')
  .option('-sty --styled <styled>', 'will this component need javascript styling', /^(yes|no)$/i, 'no')
  .action(function(name){
    co(function *() {
      var stateful = yield prompt('access state (yes): '),
          route = yield prompt('add route (yes): '),
          dispatch = yield prompt('dispatch actions (no): '),
          saga = yield prompt('create sagas (no): '),
          styled = yield prompt('include javascript styling (no): ');
      stateful = (stateful.length) ? stateful : 'yes';
      route = (route.length) ? route : 'yes';
      dispatch = (dispatch.length) ? dispatch : 'no';
      saga = (saga.length) ? saga : 'no';
      styled = (styled.length) ? styled : 'no';
      console.log('creating component %s', name);
      console.log('   routing: %s', route);
      console.log('   stateful: %s', stateful);
      console.log('   dispatch: %s', dispatch);
      console.log('   saga: %s', saga);
      console.log('   styled: %s', styled);
    });
  });

mlnckMern
  .command('create-container')
  .alias('container')
  .description('create client side container and associated files')
  .arguments('<component> [stateful] [dispatch] [saga] [styled] [tests]')
  .option('-sta --stateful <stateful>', 'will this be a stateful component', /^(yes|no)$/i, 'yes')
  .option('-d --dispatch <dispatch>', 'will this component dispatch actions', /^(yes|no)$/i, 'no')
  .option('-sa --saga <saga>', 'will this component need have side-effects', /^(yes|no)$/i, 'no')
  .option('-sty --styled <styled>', 'will this component need javascript styling', /^(yes|no)$/i, 'no')
  .action(function(component){
    co(function *() {
      var stateful = yield prompt('access state (yes): '),
          route = yield prompt('add route (yes): '),
          dispatch = yield prompt('dispatch actions (no): '),
          saga = yield prompt('create sagas (no): '),
          styled = yield prompt('include javascript styling (no): ');
      stateful = (stateful.length) ? stateful : 'yes';
      route = (route.length) ? route : 'yes';
      dispatch = (dispatch.length) ? dispatch : 'no';
      saga = (saga.length) ? saga : 'no';
      styled = (styled.length) ? styled : 'no';
      console.log('creating component %s', component);
      console.log('   routing: %s', route);
      console.log('   stateful: %s', stateful);
      console.log('   dispatch: %s', dispatch);
      console.log('   saga: %s', saga);
      console.log('   styled: %s', styled);
    });
  });

mlnckMern
  .command('create-client-route')
  .alias('croute')
  .description('create client side route')
  .arguments('<component> [path] [exact] [nested] [loadkey] [loadfnc]')
  .option('-p --path <path>', 'path to display component')
  .option('-e --exact <exact>', 'exact path', /^(yes|no)$/i, 'yes')
  .option('-n --nested <nested>', 'component this is nested within', '', '')
  .option('-lk --loadkey <loadkey>', 'key for pre-processed db query', '', '')
  .option('-lf --loadfnc <loadkfnc>', 'function for pre-processed db query', '', '')
  .action(function(name){
    co(function *() {
      var path = yield prompt('route path (/): '),
          exact = yield prompt('path is exact (yes): '),
          nested = yield prompt('component is nested within (null): '),
          loadkey = yield prompt('pre-processed db query key (null): '),
          loadfnc = yield prompt('pre-processed db query function (null): ');
      path = (path.length) ? path : '/';
      exact = (exact.length) ? exact : 'yes';
      nested = (nested.length) ? nested : 'null';
      loadkey = (loadkey.length) ? loadkey : 'null';
      loadfnc = (loadfnc.length) ? loadfnc : 'null';
      console.log('routing to component %s', name);
      console.log('   path: %s', path);
      console.log('   exact: %s', exact);
      console.log('   nested: %s', nested);
      console.log('   loadkey: %s', loadkey);
      console.log('   loadfnc: %s', loadfnc);
    });
  });

mlnckMern
  .command('create-server-route')
  .alias('sroute')
  .description('create server side route')
  .arguments('<name> [controller] [schema]')
  .option('-c --controller <controller>', 'create route controller', /^(yes|no)$/i, 'yes')
  .option('-s --schema <schema>', 'create route schema', /^(yes|no)$/i, 'yes')
  .action(function(name){
    co(function *() {
      var controller = yield prompt('create controller (yes): '),
          schema = yield prompt('create schema (yes): ');
      controller = (controller.length) ? controller : 'yes';
      schema = (schema.length) ? schema : 'yes';
      console.log('creating server route: %s', name);
      console.log('   controller: %s', controller);
      console.log('   schema: %s', schema);
    });
  });

mlnckMern
  .command('create-server-controller')
  .alias('controller')
  .description('create server side controller')
  .action(function(name){
    co(function *() {
      console.log('creating server:',name);
    });
  });

mlnckMern
  .command('create-server-schema')
  .alias('schema')
  .description('create server side schema')
  .action(function(name){
    co(function *() {
      console.log('creating schema:',name);
    });
  });

mlnckMern
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env);
  });

mlnckMern.parse(process.argv);


/*
.action(function(sample) {
  co(function *() {
    var name = yield prompt('project name: '),
        sample = yield prompt.password('Install Sample Files: ');
    console.log('%s -> creating: %s: installing files?: %s', command, name, sample);
  });
});
*/

/*
program
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env);
  });
*/

// https://github.com/tj/commander.js#coercion
/*
function range(val) {
  return val.split('..').map(Number);
}

function list(val) {
  return val.split(',');
}

function collect(val, memo) {
  memo.push(val);
  return memo;
}

function increaseVerbosity(v, total) {
  return total + 1;
}

program
  .version('0.1.0')
  .usage('[options] <file ...>')
  .option('-i, --integer <n>', 'An integer argument', parseInt)
  .option('-f, --float <n>', 'A float argument', parseFloat)
  .option('-r, --range <a>..<b>', 'A range', range)
  .option('-l, --list <items>', 'A list', list)
  .option('-o, --optional [value]', 'An optional value')
  .option('-c, --collect [value]', 'A repeatable value', collect, [])
  .option('-v, --verbose', 'A value that can be increased', increaseVerbosity, 0)
  .parse(process.argv);

console.log(' int: %j', program.integer);
console.log(' float: %j', program.float);
console.log(' optional: %j', program.optional);
program.range = program.range || [];
console.log(' range: %j..%j', program.range[0], program.range[1]);
console.log(' list: %j', program.list);
console.log(' collect: %j', program.collect);
console.log(' verbosity: %j', program.verbose);
console.log(' args: %j', program.args);

---------

program
  .version('0.1.0')
  .option('-s --size <size>', 'Pizza size', /^(large|medium|small)$/i, 'medium')
  .option('-d --drink [drink]', 'Drink', /^(coke|pepsi|izze)$/i)
  .parse(process.argv);

console.log(' size: %j', program.size);
console.log(' drink: %j', program.drink);
*/
