const chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  basePath = process.env.PWD;

function gitPull(s)
{
  if(fs.existsSync(`${basePath}/${s}`))
  {
    console.log(' ');
    console.log(chalk.red.bold.underline(`** ${s} directory already exits! Please give the project a unique name **`));
    console.log(' ');
    process.exit(1);
  }
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

  // Pull the corresponding variant into the given folder
  // sh.exec('git pull https://github.com/mlnck/MERNSkeleton.git master', (code) => {
  //     clearInterval(interval);
  //     logUpdate.clear();
  //     if (code !== 0) {
  //         console.log(chalk.red.bold('Error! Try again'));
  //         exit(1);
  //     }
  //     console.log(chalk.green.bold('Completed.....You are good to go!'));
  // });

  sh.exec('git pull https://github.com/mlnck/MERNSkeleton.git master');
  clearInterval(interval);
  console.log(chalk.magenta('removing .git '));
}

module.exports = gitPull;
