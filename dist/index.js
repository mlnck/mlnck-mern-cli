#!/usr/bin/env node --harmony


const chalk = require('chalk'),
  co = require('co'),
  prompt = require('co-prompt'),
  mlnckMern = require('commander'),

  removeSample = require('./commands/remove-sample'),
  installStack = require('./commands/install-stack');

mlnckMern
  .version('0.0.1');

mlnckMern
  .command('create-project')
  .alias('create')
  .description('create new mlnck-mern project')
  .arguments('[install-sample] [add-optional]')
  .option('-a --author <author>', 'author')
  .option('-i --install-sample <sample>', 'install sample project', /^(yes|no)$/i, 'yes')
  .option('-o --add-optional <optional>', 'add optional components', /^(yes|no)$/i, 'no')
  .action(() =>
  {
    co(function* cproj()
    {
      const author = yield prompt('author: ');
      let sample = yield prompt('install sample project (yes): '),
        optional = yield prompt('add optional components (no): ');
      sample = (sample.length) ? sample : 'yes';
      optional = (optional.length) ? optional : 'no';
      // console.log('creating/setup for project named %s', projectName);
      console.log('   with sample: %s', sample);
      console.log('   add optional: %s', optional);
      installStack(author, sample, optional);
      process.exit(0);
    });
  });

mlnckMern
  .command('remove-sample')
  .alias('remove')
  .description('remove smaple files and logs which may have been initially installed')
  .action(() =>
  {
    co(function* rsample()
    {
      const bool = yield prompt.confirm('remove sample files: (n)');
      if(bool)
      { removeSample(); }
      else { console.log(chalk.yellow.bold('Files not removed')); }
      process.exit(0);
    });
  });

mlnckMern
  .command('include-optional')
  .alias('optional')
  .description('include optional components')
  .action(() =>
  {
    co(function* incopt()
    {
      const bool = yield prompt.confirm('include optional files: ');
      console.log('including files:', bool);
      process.exit(0);
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
  .action((name) =>
  {
    co(function* ccomp()
    {
      let stateful = yield prompt('access state (yes): '),
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
      process.exit(0);
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
  .action((component) =>
  {
    co(function* ccont()
    {
      let stateful = yield prompt('access state (yes): '),
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
      process.exit(0);
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
  .action((name) =>
  {
    co(function* ccrte()
    {
      let path = yield prompt('route path (/): '),
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
      process.exit(0);
    });
  });

mlnckMern
  .command('create-server-route')
  .alias('sroute')
  .description('create server side route')
  .arguments('<name> [controller] [schema]')
  .option('-c --controller <controller>', 'create route controller', /^(yes|no)$/i, 'yes')
  .option('-s --schema <schema>', 'create route schema', /^(yes|no)$/i, 'yes')
  .action((name) =>
  {
    co(function* csrte()
    {
      let controller = yield prompt('create controller (yes): '),
        schema = yield prompt('create schema (yes): ');
      controller = (controller.length) ? controller : 'yes';
      schema = (schema.length) ? schema : 'yes';
      console.log('creating server route: %s', name);
      console.log('   controller: %s', controller);
      console.log('   schema: %s', schema);
      process.exit(0);
    });
  });

mlnckMern
  .command('create-server-controller')
  .alias('controller')
  .arguments('<name>')
  .description('create server side controller')
  .action((name) =>
  {
    co(function* cscont()
    {
      console.log('creating server:', name);
      process.exit(0);
    });
  });

mlnckMern
  .command('create-server-schema')
  .alias('schema')
  .arguments('<name>')
  .description('create server side schema')
  .action((name) =>
  {
    co(function* cschema()
    {
      console.log('creating schema:', name);
      process.exit(0);
    });
  });

mlnckMern
  .command('*')
  .action((env) =>
  {
    console.log('environment: "%s"', env);
  });

mlnckMern.parse(process.argv);

/*
while true; do
    read -p "Do you wish to install this program?" yn
    case $yn in
        [Yy]* ) make install; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

https://stackoverflow.com/questions/226703/how-do-i-prompt-for-yes-no-cancel-input-in-a-linux-shell-script/27875395#27875395
*/
