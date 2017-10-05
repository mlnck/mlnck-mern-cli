#!/usr/bin/env node --harmony

const chalk = require('chalk'),
  fs = require('fs'),
  inquirer = require('inquirer'),
  mlnckMern = require('commander'),

  { dirExists, nestedPaths } = require('./utils'),

  createClient = require('./commands/create-client'),
  createClientRoute = require('./commands/create-client-route'),
  createServerRoute = require('./commands/create-server-route'),
  createSchema = require('./commands/create-schema'),
  gitPull = require('./commands/git-pull.js'),
  installStack = require('./commands/install-stack'),
  removeSample = require('./commands/remove-sample');

mlnckMern.onRoot = function checkLoc(s)
{
  if(!fs.existsSync('./package.json'))
  {
    console.log(chalk.red.bold.underline('** Please run all scripts from the root of your project **'));
    process.exit(1);
  }
  return s;
};

mlnckMern
  .version('0.0.1');

mlnckMern
  .command('create')
  .description('install new mlnck-mern project')
  .arguments('<project-name> [prev-version]')
  .action((projectName, prevVersion) =>
  {
    const newQuestions = [
      { type: 'confirm', name: 'createNew', message: `Create new project ${projectName}?`, default: true }
    ];
    inquirer.prompt(newQuestions).then((answers) =>
    {
      if(answers.createNew)
      {
        if(typeof (prevVersion) !== 'undefined')
        {
          console.log(chalk.magenta.bold.bgBlack.underline(`
                                                                                    TODO:\r`) +
          chalk.bgBlack.white(`
                        • I will update master as new versions of react/node/mongo/etc   \r
                          come out. Will make branches for previous versions, and this   \r
                          will allow you to specify which version to download.           \r
                                                                                         \r
                        • Also stub place where if version is defined it looks to a      \r
                          specific folder to grab the internal "commands" scripts.       \r
                          (e.g. commands/v16/create-client-route.js)                     \r
                                                                                         \r
                        •  Also add in help command that will list all available versions
                                                                                         \r`));
          process.exit(0);
        }

        gitPull(projectName);
      }
      process.exit(0);
    });
  });

mlnckMern
  .command('configure-project')
  .alias('configure')
  .description('configure initial settings of currently installed mlnck-mern project')
  .action(() =>
  {
    mlnckMern.onRoot();
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
        default: 'no',
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
    mlnckMern.onRoot();
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

/////////booga

mlnckMern
  .command('new-full-stack-element')
  .alias('new')
  .description(`create paths, containers/components, and associated client
                and server side files for new elements`)
  .arguments('<name>')
  .action((name) =>
  {
    mlnckMern.onRoot();
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
  .command('new-element')
  .alias('new')
  .description('create paths, containers/components, and associated files for new elements')
  .arguments('<name>')
  .action((name) =>
  {
    mlnckMern.onRoot();
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
  .action((path) =>
  {
    // mlnckMern.onRoot();
    if(path.charAt(0) !== '/'){ path = `/${path}`; } //eslint-disable-line
    // dirExists(path);//not sure about this - if enabled then I think it would ruin custom pathing
    const nestedPathArr = nestedPaths();
    nestedPathArr.shift();
    // console.log('nestedPathArray:', nestedPathArr);

    const compName = path.split('/').pop(),
      crouteQuestions = [
        { type: 'confirm', name: 'verifyPath', message: `Path is ${path}(true):`, default: true },
        {
          type: 'input',
          name: 'pathOverride',
          message: 'What is the component/container path',
          default: '/',
          when(answers)
          { return !answers.verifyPath; },
          validate(value)
          {
            const valid = !!(value.length);
            return (valid) ? true : 'Please enter the component/container path';
          },
          filter: String
        },
        { type: 'confirm', name: 'containerName', message: `component/container name is: ${compName}?` },
        {
          type: 'input',
          name: 'containerNameOverride',
          message: 'What is the component/container name',
          when(answers)
          {
            if(answers.containerName){ dirExists(compName); }// check file exists if user agreed with default above
            return !answers.containerName;
          },
          validate(value)
          {
            dirExists(value);// check file exists if user agreed entered custom information
            const valid = !!(value.length);
            return (valid) ? true : 'Please enter a component/container name';
          },
          filter: String
        },
        {
          type: 'list',
          name: 'hasParent',
          message: 'Is this a nested component/container?',
          choices: ['Yes', 'No'],
          default: 'No',
          filter(val){ return (val === 'Yes'); }
        },
        {
          type: 'list',
          name: 'parentContainer',
          message: 'Select the parent route',
          choices: nestedPathArr,
          when(answers)
          { return answers.hasParent; }
        },
        { type: 'confirm',
          name: 'exactPath',
          message: 'Path is exact?',
          filter(val){ return (val === 'yes'); }
        },
        { type: 'input', name: 'loadkey', message: 'pre-processed db query key (null):' },
        { type: 'input',
          name: 'loadfnc',
          message: 'pre-processed db query function (null):',
          when(answers)
          { return answers.loadkey; }
        }
      ];
    inquirer.prompt(crouteQuestions).then((answers) =>
    {
      answers.path = path; // eslint-disable-line
      createClientRoute(answers);
      process.exit(0);
    });
  });

mlnckMern
  .command('create-server-route')
  .alias('sroute')
  .description('create server side route')
  .arguments('<path>')
  .action((path) =>
  {
    mlnckMern.onRoot();
    const srouteQuestions = [
      {
        type: 'list',
        name: 'createController',
        message: 'Create controller?',
        choices: ['yes', 'no'],
        filter(val){ return (val === 'yes'); }
      },
      { type: 'list',
        name: 'createSchema',
        message: 'Create schema?',
        choices: ['yes', 'no'],
        filter(val){ return (val === 'yes'); }
      }
    ];
    inquirer.prompt(srouteQuestions).then((answers) =>
    {
      answers.path = path; // eslint-disable-line
      createServerRoute(answers);
      process.exit(0);
    });
  });

mlnckMern
  .command('create-schema')
  .alias('schema')
  .description('create schema file for mongoose integration')
  .arguments('<name>')
  .action((name) =>
  {
    mlnckMern.onRoot();
    const createSchemaQuestions = [
      { type: 'confirm', name: 'createSchema', message: `Create schema ${name}?`, default: true }
    ];
    inquirer.prompt(createSchemaQuestions).then((answers) =>
    {
      if(answers.createSchema)
      { createSchema(name); }
      else
      { console.log(chalk.yellow.bold('No schema created')); }

      process.exit(0);
    });
  });

/////

mlnckMern
  .command('*')
  .action((env) =>
  {
    console.log('environment: "%s"', env);
  });

mlnckMern.parse(process.argv);
