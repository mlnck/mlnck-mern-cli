#!/usr/bin/env node --harmony


let chalk = require('chalk'),
  fs = require('fs'),
  fuzzy = require('fuzzy'),
  inquirer = require('inquirer'),
  mlnckMern = require('commander'),
  Promise = require('promise'),
  _require = require('./utils'),
  dirExists = _require.dirExists,
  nestedPaths = _require.nestedPaths,
  filesInDir = _require.filesInDir,
  createClient = require('./commands/create-client'),
  createClientRoute = require('./commands/create-client-route'),
  createServerRoute = require('./commands/create-server-route'),
  createSchema = require('./commands/create-schema'),
  gitPull = require('./commands/git-pull.js'),
  installStack = require('./commands/install-stack'),
  removeSample = require('./commands/remove-sample');


inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

mlnckMern.onRoot = function checkLoc(s)
{
  if(!fs.existsSync('./package.json'))
  {
    console.log(chalk.red.bold.underline('** Please run all scripts from the root of your project **'));
    process.exit(1);
  }
  return s;
};

mlnckMern.version('0.0.1');

mlnckMern.command('create').description('install new mlnck-mern project').arguments('<project-name> [prev-version]').action((projectName, prevVersion) =>
{
  const newQuestions = [{ type: 'confirm', name: 'createNew', message: `Create new project ${projectName}?`, default: true }];
  inquirer.prompt(newQuestions).then((answers) =>
  {
    if(answers.createNew)
    {
      if(typeof prevVersion !== 'undefined')
      {
        console.log(chalk.magenta.bold.bgBlack.underline('\n                                                                                    TODO:\r') + chalk.bgBlack.white('\n                        \u2022 I will update master as new versions of react/node/mongo/etc   \r\n                          come out. Will make branches for previous versions, and this   \r\n                          will allow you to specify which version to download.           \r\n                                                                                         \r\n                        \u2022 Also stub place where if version is defined it looks to a      \r\n                          specific folder to grab the internal "commands" scripts.       \r\n                          (e.g. commands/v16/create-client-route.js)                     \r\n                                                                                         \r\n                        \u2022  Also add in help command that will list all available versions\n                                                                                         \r'));
        process.exit(0);
      }

      gitPull(projectName);
    }
    process.exit(0);
  });
});

mlnckMern.command('configure-project').alias('configure').description('configure initial settings of currently installed mlnck-mern project').action(() =>
{
  mlnckMern.onRoot();
  const createProjectQuestions = [{ type: 'input',
    name: 'author',
    message: 'author:',
    validate: function validate(value)
    {
      const valid = !!value.length;
      return valid || 'Please enter an author';
    },

    filter: String
  }, { type: 'list',
    name: 'sample',
    message: 'Install sample project?',
    choices: ['yes', 'no'],
    default: 'no',
    filter: function filter(val)
    {
      return val === 'yes';
    }
  }, { type: 'list',
    name: 'optional',
    message: 'Install optional components?',
    choices: ['yes', 'no'],
    default: 'no',
    filter: function filter(val)
    {
      return val === 'yes';
    }
  }];
  inquirer.prompt(createProjectQuestions).then((answers) =>
  {
    installStack(answers);
    process.exit(0);
  });
});

mlnckMern.command('remove-sample').alias('remove').description('remove smaple files and logs which may have been initially installed').action(() =>
{
  mlnckMern.onRoot();
  const removeQuestions = [{ type: 'confirm', name: 'removeSample', message: 'Remove sample files?', default: true }];
  inquirer.prompt(removeQuestions).then((answers) =>
  {
    if(answers.removeSample)
    {
      removeSample();
    }
    else
    {
      console.log(chalk.yellow.bold('Files not removed'));
    }

    process.exit(0);
  });
});

mlnckMern.command('new-element').alias('new').description('create paths, containers/components, and associated files for new elements').arguments('<name>').action((name) =>
{
  mlnckMern.onRoot();
  const createClientQuestions = [{ type: 'list', name: 'type', message: 'Type?', choices: ['container', 'component'] }, { type: 'list',
    name: 'stateful',
    message: 'will this be a stateful component?',
    choices: ['yes', 'no'],
    filter: function filter(val)
    {
      return val === 'yes';
    }
  }, { type: 'list',
    name: 'route',
    message: 'create route?',
    choices: ['yes', 'no'],
    filter: function filter(val)
    {
      return val === 'yes';
    }
  }, { type: 'list',
    name: 'dispatch',
    message: 'will this component dispatch actions?',
    choices: ['yes', 'no'],
    filter: function filter(val)
    {
      return val === 'yes';
    }
  }, { type: 'list',
    name: 'saga',
    message: 'will this component have side-effects?',
    choices: ['yes', 'no'],
    filter: function filter(val)
    {
      return val === 'yes';
    }
  }, { type: 'list',
    name: 'styled',
    message: 'will this component need javascript styling?',
    choices: ['yes', 'no'],
    filter: function filter(val)
    {
      return val === 'yes';
    },
    default: 'no' }];

  inquirer.prompt(createClientQuestions).then((answers) =>
  {
    answers.name = name; // eslint-disable-line
    console.log('answers:', answers);
    createClient(answers);
    process.exit(0);
  });
});

mlnckMern.command('create-client-route').alias('croute').description('create client side route').arguments('<path>').action((path) =>
{
  if(path.charAt(0) !== '/')
  {
    path = `/${path}`;
  } //eslint-disable-line
  const nestedPathArr = nestedPaths();
  nestedPathArr.shift();

  let compName = path.split('/').pop(),
    compNameCapitalized = compName.charAt(0).toUpperCase() + compName.substr(1),
    compNamePlural = compName.charAt(compName.length - 1) === 's' ? compNameCapitalized : `${compNameCapitalized}s`,
    crouteQuestions = [{ type: 'list',
      name: 'verifyPath',
      message: `Path Endpoint is ${path}:`,
      choices: ['Yes', 'No'],
      default: 'Yes',
      filter: function filter(val)
      {
        return val === 'Yes';
      }
    }, {
      type: 'input',
      name: 'pathOverride',
      message: 'What is the component/container path',
      default: '/',
      when: function when(answers)
      {
        return !answers.verifyPath;
      },
      validate: function validate(value)
      {
        const valid = !!value.length;
        return valid ? true : 'Please enter the component/container path';
      },

      filter: String
    }, { type: 'list',
      name: 'containerName',
      message: `component/container name is: ${compName}?`,
      choices: ['Yes', 'No'],
      default: 'Yes',
      filter: function filter(val)
      {
        return val === 'Yes';
      }
    }, {
      type: 'input',
      name: 'containerNameOverride',
      message: 'What is the component/container name',
      when: function when(answers)
      {
        if(answers.containerName)
        {
          dirExists(compName);
        } // check file exists if user agreed with default above
        return !answers.containerName;
      },
      validate: function validate(value)
      {
        dirExists(value); // check file exists if user agreed entered custom information
        const valid = !!value.length;
        return valid ? true : 'Please enter a component/container name';
      },

      filter: String
    }, {
      type: 'list',
      name: 'hasParent',
      message: 'Is this a nested component/container?',
      choices: ['Yes', 'No'],
      default: 'No',
      filter: function filter(val)
      {
        return val === 'Yes';
      }
    }, {
      type: 'list',
      name: 'parentContainer',
      message: 'Select the parent route',
      choices: nestedPathArr,
      when: function when(answers)
      {
        return answers.hasParent;
      }
    }, { type: 'list',
      name: 'exactPath',
      message: 'Path is exact?',
      choices: ['Yes', 'No'],
      default: 'Yes',
      filter: function filter(val)
      {
        return val === 'Yes';
      }
    }, { type: 'list',
      name: 'loadcontroller',
      message: 'pre-processed server side controller:',
      choices: ['null', `${compName.toLowerCase()}.controller.js`, 'other'],
      default: 'null',
      validate: function validate()
      {
        return true;
      }
    }, {
      type: 'autocomplete',
      name: 'loadcontroller',
      suggestOnly: true,
      message: 'enter custom pre-processed server side controller:',
      source: searchControllers,
      pageSize: 4,
      when: function when(answers)
      {
        if(answers.loadcontroller === 'other')
        {
          console.log(chalk.magenta.bold('Begin typing to filter controllers or create a new one.'));
        }
        return answers.loadcontroller === 'other';
      },
      validate: function validate(v)
      {
        console.log('val:', v.substr(-3), '?');
        return v.substr(-3) === '.js' ? true : `${v} controller cannot be blank, and must end in ".js"!\n     Remember to hit "tab" to select the element`;
      }
    }, { type: 'list',
      name: 'loadfnc',
      message: 'pre-processed server side method:',
      choices: [`getAll${compNamePlural}`, 'other', 'null'],
      default: 'other',
      when: function when(answers)
      {
        return answers.loadcontroller !== 'null';
      }
    }, { type: 'input',
      name: 'loadfnc',
      message: 'enter custom pre-processed server side method:',
      when: function when(answers)
      {
        return answers.loadfnc === 'other';
      },
      validate: function validate(value)
      {
        const valid = !!value.length;
        return valid ? true : 'Please enter a controller method to call/create';
      }
    }, { type: 'input',
      name: 'loadkey',
      message: 'enter the object key that will be used to access information on page render:',
      when: function when(answers)
      {
        return answers.loadfnc !== 'null';
      },
      validate: function validate(value)
      {
        const valid = !!value.length;
        return valid ? true : 'Please enter a key name to use when data is populated';
      }
    }, { type: 'list',
      name: 'createSchemaDne',
      message: `create ${compNameCapitalized} schema if it does not exist?`,
      choices: ['Yes', 'No'],
      default: 'Yes',
      when: function when(answers)
      {
        return answers.loadcontroller !== 'null' && answers.loadfnc !== 'null';
      },
      filter: function filter(val)
      {
        return val === 'Yes';
      }
    }];
  const cntrlrs = filesInDir('./server/controllers/');
  function searchControllers(answers)
  {
    const input = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return new Promise(((resolve) =>
    {
      const fuzzyResult = fuzzy.filter(input, cntrlrs);
      resolve(fuzzyResult.map((el) =>
        el.original));
    }));
  }
  inquirer.prompt(crouteQuestions).then((answers) =>
  {
    answers.path = path; // eslint-disable-line
    createClientRoute(answers);
    process.exit(0);
  });
});

mlnckMern.command('create-server-route').alias('sroute').description('create server side route').arguments('<path>').action((path) =>
{
  mlnckMern.onRoot();
  const srouteQuestions = [{
    type: 'list',
    name: 'createController',
    message: 'Create controller if it does not exist?',
    choices: ['yes', 'no'],
    filter: function filter(val)
    {
      return val === 'yes';
    }
  }, { type: 'list',
    name: 'createSchema',
    message: 'Create schema if it does not exist?',
    choices: ['yes', 'no'],
    filter: function filter(val)
    {
      return val === 'yes';
    }
  }];
  inquirer.prompt(srouteQuestions).then((answers) =>
  {
    answers.path = path; // eslint-disable-line
    createServerRoute(answers);
    process.exit(0);
  });
});

mlnckMern.command('create-schema').alias('schema').description('create schema file for mongoose integration').arguments('<name>').action((name) =>
{
  mlnckMern.onRoot();
  const createSchemaQuestions = [{ type: 'confirm', name: 'createSchema', message: `Create schema ${name}?`, default: true }];
  inquirer.prompt(createSchemaQuestions).then((answers) =>
  {
    if(answers.createSchema)
    {
      createSchema(name);
    }
    else
    {
      console.log(chalk.yellow.bold('No schema created'));
    }

    process.exit(0);
  });
});

mlnckMern.command('*').action((env) =>
{
  console.log('environment: "%s"', env);
  console.log('mlnckMern:', mlnckMern);
});

mlnckMern.parse(process.argv);
