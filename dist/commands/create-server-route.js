const chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  { templateRename, verifyUniqueFile } = require('../utils'),
  basePath = process.env.PWD;

function createServerRoute(routeObj)
{
  console.log('routeObj',routeObj);
  const routeRoot = `${basePath}/server/routes`,
    routeFile = `${routeRoot}/${routeObj.path.toLowerCase()}.routes.js`;
  verifyUniqueFile(routeFile);

  console.log(chalk.green.bgBlackBright.bold(' creating new server route: %s '), routeObj.path);

  console.log(chalk.magenta('-- creating file'));
  sh.cp(`${basePath}/config/templates/server/routes/_Structure.js`, `${routeFile}`);
  templateRename(routeRoot, routeObj.path);

  ///IF NOT CREATE CONTROLLER THEN GO INTO FILE AND REMOVE RELATED LINES
  ///IF CREATE SCHEMA THEN RUN MLNCK-MERN SCHEMA ***
}

module.exports = createServerRoute;
