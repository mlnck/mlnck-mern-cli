const chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  { verifyUniqueFile } = require('../utils'),
  basePath = process.env.PWD;

function gitPull(s)
{
  verifyUniqueFile(`${basePath}/${s}`);

  if(!sh.which('git'))
  {
    console.log(' ');
    console.log(chalk.red.bold.underline('** You will need to have git installed to create the project from the command line **'));
    console.log(' ');
    process.exit(1);
  }

  console.log(chalk.green.bgBlackBright.bold(' creating project %s '), s);
  console.log(chalk.magenta('-- creating project folder'));
  sh.mkdir('-p', s);
  sh.cd(s);
  console.log(chalk.magenta('-- running git init'));
  sh.exec('git init');

  console.log(chalk.magenta('-- pulling project files from git'));

  const interval = setInterval(() =>
  {
    console.log(chalk.cyan.bold.dim('Fetching the boilerplate...'));
  }, 750);

  sh.exec('git pull https://github.com/mlnck/MERNSkeleton.git master');
  clearInterval(interval);
}

module.exports = gitPull;
