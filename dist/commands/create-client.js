const chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  { templateRename } = require('../utils'),
  basePath = process.env.PWD;

let compOpts = {};

function createClient(obj)
{
  const tmpNameFirst = obj.name.charAt(0).toUpperCase();

  compOpts = { ...obj };
  compOpts.nameCapitalized = tmpNameFirst + obj.name.substr(1);
  compOpts.nameLowercase = tmpNameFirst.toLowerCase() + obj.name.substr(1);
  compOpts.destDir = `${basePath}/client/${compOpts.type}s/${compOpts.nameCapitalized}/`;
  compOpts.templatePath = `${basePath}/config/templates/client/${compOpts.type}s/_Structure/`;
  console.log(chalk.green.bgBlackBright.bold(' creating new %s: %s '), compOpts.type, compOpts.nameCapitalized);
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
    console.log(chalk.magenta('configuring saga: '));
    let storeSaga = fs.readFileSync(`${basePath}/client/store.js`, 'utf8');
    storeSaga = storeSaga.replace('// Sagas', `// Sagas\nsagaMiddleware.run(${compOpts.nameLowercase}Saga);`);
    storeSaga = storeSaga.replace('const sagaMiddleware',
      `import ${compOpts.nameLowercase}Saga from './${compOpts.type}s/${compOpts.nameCapitalized}/state/sagas';
                                      \n\nconst sagaMiddleware`);
    fs.writeFileSync(`${basePath}/client/store.js`, storeSaga);
  }
  else
  {
    console.log(chalk.magenta('removing saga: '));
    fs.unlinkSync(`${compOpts.destDir}/state/sagas.js`);
  }
  handleJsStyled();
}

function handleJsStyled()
{
  if(compOpts.styled)
  {
    console.log(chalk.magenta('adding js styles: '));
    sh.cp(`${compOpts.templatePath}StyledXxx.js`, `${compOpts.destDir}Styled${compOpts.nameCapitalized}.js`);
    let styledData = fs.readFileSync(`${compOpts.destDir}Styled${compOpts.nameCapitalized}.js`, 'utf8');
    styledData = styledData.replace(/StyledXxx/g, `Styled${compOpts.nameCapitalized}`);
    fs.writeFileSync(`${compOpts.destDir}Styled${compOpts.nameCapitalized}.js`, styledData);
  }
  else
  {
    console.log(chalk.magenta('removing js styles: '));
    let stylelessData = fs.readFileSync(`${compOpts.destDir}index.js`, 'utf8');
    stylelessData = stylelessData.replace(/\/\/.*Vis.*[\s\S]*?Xxx';[\s\S].?/g, '');
    fs.writeFileSync(`${compOpts.destDir}index.js`, stylelessData);
  }
  renameTemplates();
}

function renameTemplates()
{
  templateRename(compOpts.destDir, compOpts.nameCapitalized, compOpts.nameLowercase);
  handleRoute();
}

function handleRoute()
{
  if(compOpts.route)
  { sh.exec(`mlnck-mern croute /${compOpts.nameCapitalized}`); }
}

module.exports = createClient;
