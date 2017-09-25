const chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  { templateRename } = require('../utils'),
  basePath = process.env.PWD,
  compOpts = {};

function createClient(t, n, s, r, d, sa, st)
{
  const tmpNameFirst = n.charAt(0).toUpperCase();

  compOpts.type = t;
  compOpts.stateful = (~s.indexOf('n') > -1);
  compOpts.route = (~r.indexOf('n') > -1);
  compOpts.dispatch = (~d.indexOf('n') > -1);
  compOpts.saga = (~sa.indexOf('n') > -1);
  compOpts.styled = (~st.indexOf('n') > -1);
  compOpts.nameCapitalized = tmpNameFirst + n.substr(1);
  compOpts.nameLowercase = tmpNameFirst.toLowerCase() + n.substr(1);
  compOpts.destDir = `${basePath}/client/${t}s/${compOpts.nameCapitalized}/`;
  compOpts.templatePath = `${basePath}/config/templates/client/${t}s/_Structure/`;
  console.log(chalk.green.bgBlackBright.bold(' creating new %s: %s '), t, compOpts.nameCapitalized);
  createFile();
}

function createFile()
{
  if(fs.existsSync(compOpts.destDir))
  {
    console.log(' ');
    console.log(chalk.red.bold.underline(`** ${compOpts.nameCapitalized} ${compOpts.type} already exits! Please give the ${compOpts.type} a unique name **`));
    console.log(' ');
    process.exit(1);
  }
  console.log(chalk.magenta(`-- creating ${compOpts.type} folder`));
  sh.mkdir('-p', compOpts.destDir);

  console.log(chalk.magenta('-- creating file'));
  sh.cp(`${compOpts.templatePath}index.js`, `${compOpts.destDir}index.js`);

  sh.cd(compOpts.destDir);
  console.log(chalk.magenta('configuring template name: '));
  if(fs.statSync(`${compOpts.destDir}index.js`).isFile())
  {
    let configuredData = fs.readFileSync(`${compOpts.destDir}index.js`, 'utf8');
    if(compOpts.stateful)
    {
      console.log(chalk.magenta('-- with state: '));
      configuredData = configuredData.replace(/[\s]?export\sd.*fun.*/g, '');
    }
    else
    {
      console.log(chalk.magenta('-- without state: '));
      configuredData = configuredData.replace(/class\sXxx.*React.Component/g, '');
      configuredData = configuredData.replace(/export\sfu[\s\S]*.?/g, '');
    }
    fs.writeFileSync(`${compOpts.destDir}index.js`, configuredData);
  }
  handleActions();
}

function handleActions()
{
  if(compOpts.dispatch)
  {
    sh.cp('-r', `${compOpts.templatePath}state/`, `${compOpts.destDir}state/`);
    let reducerFile = fs.readFileSync(`${basePath}/client/reducers.js`, 'utf8');
    reducerFile = reducerFile.replace('/Root/reducer\';', `/Root/reducer';\nimport ${compOpts.nameLowercase}Reducer from './${compOpts.type}s/${compOpts.nameCapitalized}/state/reducer';`);
    reducerFile = reducerFile.replace('globalReducer,', `globalReducer,\n${compOpts.nameLowercase}:${compOpts.nameLowercase}Reducer,`);
    fs.writeFileSync(`${basePath}/client/reducers.js`, reducerFile);
  }
  else
  {
    let configuredData = fs.readFileSync(`${compOpts.destDir}index.js`, 'utf8');
    configuredData = configuredData.replace(/export.*tch\)[\s\S]*?.*}[\s\S]*?.*}/g, '');
    configuredData = configuredData.replace(', mapDispatchToProps', '');
    fs.writeFileSync(`${compOpts.destDir}index.js`, configuredData);
  }

  if(compOpts.saga)
  {
    // update store to use saga
  }
  else
  {
    // delete saga files
    // delete selector file
  }
  handleJsStyled();
}

function handleJsStyled()
{
  // opt- js styling
  handleRoute();
}

function handleRoute()
{
  // opt- route
  // sh.exec('croute compOpts.nameLowercase ');
  renameTemplates();
}

function renameTemplates()
{ templateRename(compOpts.destDir, compOpts.nameCapitalized, compOpts.nameLowercase); }

module.exports = createClient;
