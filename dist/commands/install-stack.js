/*
"slate": "rimraf node_modules && yarn",
    "start":"echo Please install:; echo  --  mlnck-mern-cli; echo and then run:; echo -- mlnck-mern create your-project-name-here; echo ; echo ; echo ;",
*/
const chalk = require('chalk'),
  fs = require('fs'),
  { delDir } = require('../utils'),
  removeSample = require('./remove-sample'),

  basePath = process.env.PWD,
  projName = basePath.split('/').pop();

let userOpts = {};

function installStack(a, s, o)
{
  userOpts = { a, s, o, n: projName };
  console.log(chalk.green.bgBlackBright.bold(' creating project %s'), userOpts.n);

  console.log(chalk.magenta('removing .git '));
  if(fs.existsSync(`${basePath}/.git`) && fs.statSync(`${basePath}/.git`).isDirectory())
  { delDir(`${basePath}/.git`); }

  rewritePackage();
}

function rewritePackage()
{
  console.log(chalk.magenta('updating package.json '));
  let jsonData = fs.readFileSync(`${basePath}/package.json`, 'utf8');
  jsonData = jsonData
    .replace(/\"s.*;",[\s]*?\s*/g, '') // eslint-disable-line
    .replace(':aftercreate', '')
    .replace('"mlnck"', `"${userOpts.a}"`);
  fs.writeFileSync(`${basePath}/package.json`, jsonData);
  handleOptional();
}

function handleOptional()
{
  console.log(chalk.underline((!userOpts.o.match(/no?/)) ? 'adding ' : 'removing ') +
                chalk.magenta(' optional components'));

  const optPath = `${basePath}/client/components/optionalelements`;
  if(!userOpts.o.match(/no?/))
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

  if(userOpts.s.match(/no?/))
  { removeSample(); }
}

module.exports = installStack;
