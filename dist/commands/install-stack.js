const chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  { delDir } = require('../utils'),
  removeSample = require('./remove-sample'),

  basePath = process.env.PWD,
  projName = basePath.split('/').pop();

let userOpts = {};

function installStack(answers)
{
  userOpts = { ...answers, n: projName };
  console.log(chalk.green.bgBlackBright.bold(' creating project %s'), userOpts.n);


  rewritePackage();
}

function rewritePackage()
{
  console.log(chalk.magenta('updating package.json '));
  let jsonData = fs.readFileSync(`${basePath}/package.json`, 'utf8');
  jsonData = jsonData
    .replace(/\"s.*;",[\s]*?\s*/g, '') // eslint-disable-line
    .replace(':aftercreate', '')
    .replace('"mlnckmern"', `"${userOpts.n}"`)
    .replace('"mlnck"', `"${userOpts.author}"`);
  fs.writeFileSync(`${basePath}/package.json`, jsonData);
  handleOptional();
}

function handleOptional()
{
  console.log(chalk.underline((userOpts.optional) ? 'adding ' : 'removing ') +
                chalk.magenta(' optional components'));

  const optPath = `${basePath}/client/components/optionalelements`;
  if(userOpts.optional)
  {
    // move components from inside folder to outside
    let files = [];
    if(fs.existsSync(optPath))
    {
      files = fs.readdirSync(optPath);
      files.forEach((file) =>
      {
        const curPath = `${optPath}/${file}`;
        console.log(chalk.keyword('orange')('     adding: ') + chalk.underline(curPath));
        fs.renameSync(curPath, `${basePath}/client/components/${file}`);
      });
    }
  }
  delDir(optPath);

  if(!userOpts.sample)
  { removeSample(); }

  installPackages();
}

function installPackages()
{
  if(fs.existsSync('./package.json'))
  {
    console.log(chalk.magenta('installing node packages'));
    console.log(chalk.keyword('orange').bold(' *** This may take a few minutes *** '));
    if(sh.which('yarn'))
    {
      console.log(chalk.magenta('running: ') + chalk.underline('yarn'));
      sh.exec('yarn --verbose');
    }
    else
    {
      console.log(chalk.magenta('running: ') + chalk.underline('npm install'));
      sh.exec('npm install');
    }
  }
}

module.exports = installStack;
