#!/usr/bin/env node --harmony


const chalk = require('chalk'),
  fs = require('fs'),
  inquirer = require('inquirer'),
  mlnckMern = require('commander'),

  gitPull = require('./commands/git-pull.js'),
  installStack = require('./commands/install-stack'),
  removeSample = require('./commands/remove-sample'),
  createClient = require('./commands/create-client'),
  createClientRoute = require('./commands/create-client-route');

mlnckMern
  .version('0.0.1');

mlnckMern
  .command('new')
  .description('install new mlnck-mern project')
  .arguments('<project-name>')
  .action((projectName) =>
  {
    const newQuestions = [
      { type: 'confirm', name: 'createNew', message: `Create new project ${projectName}?`, default: true }
    ];
    inquirer.prompt(newQuestions).then((answers) =>
    {
      if(answers.createNew)
      { gitPull(projectName); }
      process.exit(0);
    });
  });

mlnckMern
  .command('create-project')
  .alias('create')
  .description('configure initial settings of currently installed mlnck-mern project')
  .option('-a --author <author>', 'author')
  .option('-i --install-sample <sample>', 'install sample project', /^(yes|no)$/i, 'yes')
  .option('-o --add-optional <optional>', 'add optional components', /^(yes|no)$/i, 'no')
  .action(() =>
  {
    const createProjectQuestions = [
      { type: 'input',
        name: 'author',
        message: 'author:',
        validate(value)
        {
          const valid = !!(value.length);
          return valid || 'Please enter an author';
        },
        filter: String
      },
      { type: 'list',
        name: 'sample',
        message: 'Install sample project?',
        choices: ['yes', 'no'],
        filter(val){ return (val === 'yes'); }
      },
      { type: 'list',
        name: 'optional',
        message: 'Install optional components?',
        choices: ['yes', 'no'],
        default: 'no',
        filter(val){ return (val === 'yes'); }
      }
    ];
    inquirer.prompt(createProjectQuestions).then((answers) =>
    {
      installStack(answers);
      process.exit(0);
    });
  });

mlnckMern
  .command('remove-sample')
  .alias('remove')
  .description('remove smaple files and logs which may have been initially installed')
  .action(() =>
  {
    const removeQuestions = [
      { type: 'confirm', name: 'removeSample', message: 'Remove sample files?', default: true }
    ];
    inquirer.prompt(removeQuestions).then((answers) =>
    {
      if(answers.removeSample)
      { removeSample(); }
      else
      { console.log(chalk.yellow.bold('Files not removed')); }

      process.exit(0);
    });
  });

mlnckMern
  .command('create-client')
  .alias('client')
  .description('create client side container or component and associated files')
  .arguments('<name> [type] [stateful] [dispatch] [saga] [styled] [tests]')
  .option('-t --type <type>', 'type of component', /^(component|container)$/i, 'container')
  .option('-sta --stateful <stateful>', 'will this be a stateful component', /^(yes|no)$/i, 'yes')
  .option('-r --add-route <route>', 'create route', /^(yes|no)$/i, 'yes')
  .option('-d --dispatch <dispatch>', 'will this component dispatch actions', /^(yes|no)$/i, 'no')
  .option('-sa --saga <saga>', 'will this component have side-effects', /^(yes|no)$/i, 'no')
  .option('-sty --styled <styled>', 'will this component need javascript styling', /^(yes|no)$/i, 'no')
  .action((name) =>
  {
    const createClientQuestions = [
      { type: 'list', name: 'type', message: 'Type?', choices: ['container', 'component'] },
      { type: 'list', name: 'stateful', message: 'will this be a stateful component?', choices: ['yes', 'no'] },
      { type: 'list', name: 'route', message: 'create route?', choices: ['yes', 'no'] },
      { type: 'list', name: 'dispatch', message: 'will this component dispatch actions?', choices: ['yes', 'no'] },
      { type: 'list', name: 'saga', message: 'will this component have side-effects?', choices: ['yes', 'no'] },
      { type: 'list', name: 'styled', message: 'will this component need javascript styling?', choices: ['yes', 'no'], default: 'no' }
    ];

    inquirer.prompt(createClientQuestions).then((answers) =>
    {
      answers.name = name; // eslint-disable-line
      console.log('answers:', answers);
      createClient(answers);
      process.exit(0);
    });
  });


mlnckMern
  .command('create-client-route')
  .alias('croute')
  .description('create client side route')
  .arguments('<path>')
  .option('-vp --verify-path <verifypath>', 'verify path', '', '')
  .option('-c --container-name <containername>', 'container name (if different from end of path)', '', '')
  .option('-e --exact <exact>', 'exact path', /^(yes|no)$/i, 'yes')
  .option('-pc --parent-container [parentcontainer]', 'parent container path', '', '')
  .option('-lk --loadkey [loadkey]', 'key for pre-processed db query', '', '')
  .option('-lf --loadfnc [loadkfnc]', 'function for pre-processed db query', '', '')
  .action((path) =>
  {
    if(
      !fs.existsSync(`${process.env.PWD}/client/components/${path.split('/').pop()}`)
        &&
      !fs.existsSync(`${process.env.PWD}/client/containers/${path.split('/').pop()}`)
    )
    {
      console.log(chalk.red.bold(' ** Container or Component does not exist. Please add it before the route. ** '));
      console.log(chalk.red(' ** Also, make sure you are at the root of your project. ** '));
      process.exit(1);
    }

    const compName = path.split('/').pop(),
      crouteQuestions = [
        { type: 'confirm', name: 'verifyPath', message: `Path is ${path}(true):`, default: true },
        { type: 'confirm', name: 'containerName', message: `component/container name is: ${compName}?` },
        {
          type: 'input',
          name: 'continerNameOverride',
          message: 'What is the component/container name',
          when(answers)
          {
            return !answers.containerName;
          },
          validate(value)
          {
            if(
              !fs.existsSync(`${process.env.PWD}/client/components/${value.split('/').pop()}`)
                    &&
                  !fs.existsSync(`${process.env.PWD}/client/containers/${value.split('/').pop()}`)
            )
            {
              console.log(chalk.red.bold(' ** Container or Component does not exist. Please add it before the route. ** '));
              console.log(chalk.red(' ** Also, make sure you are at the root of your project. ** '));
              process.exit(1);
            }

            const valid = !!(value.length);
            return (valid) ? true : 'Please enter a component/container name';
          },
          filter: String
        },
        { type: 'confirm',
          name: 'exactPath',
          message: 'Path is exact?',
          filter(val){ return (val === 'yes'); }
        },
        { type: 'input', name: 'parentContainer', message: 'Parent container path (null):' },
        { type: 'input', name: 'loadkey', message: 'pre-processed db query key (null):' },
        { type: 'input', name: 'loadfnc', message: 'pre-processed db query function (null):' }
      ];
    inquirer.prompt(crouteQuestions).then((answers) =>
    {
      console.log('\nclient-route:');
      console.log(JSON.stringify(answers, null, '  '));
      createClientRoute(answers);
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
    const srouteQuestions = [
      {
        type: 'list',
        name: 'createController',
        message: 'Create controller?',
        choices: ['yes', 'no'],
        filter(val){ return (val === 'yes'); }
      },
      { type: 'list',
        name: 'schema',
        message: 'Create schema?',
        choices: ['yes', 'no'],
        filter(val){ return (val === 'yes'); }
      }
    ];
    inquirer.prompt(srouteQuestions).then((answers) =>
    {
      answers.name = name; // eslint-disable-line
      console.log('answers:', answers);
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
