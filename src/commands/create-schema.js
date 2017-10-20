const chalk = require('chalk'),
  sh = require('shelljs'),
  { templateRename, verifyUniqueFile } = require('../utils'),
  basePath = process.env.PWD;

function createSchema(schemaName)
{
  const schemaNameArr = schemaName.split('.');
  schemaName = schemaNameArr[0].toLowerCase() + '.model.js';//eslint-disable-line
  const schemaRoot = `${basePath}/server/models`,
    schemaFile = `${schemaRoot}/${schemaName}`;
  verifyUniqueFile(schemaFile);

  console.log(chalk.green.bgBlackBright.bold(' creating new schema: %s '), schemaNameArr[0]);

  console.log(chalk.magenta('-- creating file'));
  sh.cp(`${basePath}/config/templates/server/models/_Structure.js`, `${schemaFile}`);
  templateRename(schemaRoot, schemaNameArr[0]);
}

module.exports = createSchema;
