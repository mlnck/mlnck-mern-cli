const chalk = require('chalk'),
  sh = require('shelljs'),
  { templateRename, verifyUniqueFile } = require('../utils'),
  basePath = process.env.PWD;

function createSchema(schemaName)
{
  const schemaRoot = `${basePath}/server/models`,
    schemaFile = `${schemaRoot}/${schemaName.toLowerCase()}.js`;
  verifyUniqueFile(schemaFile);

  console.log(chalk.green.bgBlackBright.bold(' creating new schema: %s '), schemaName);

  console.log(chalk.magenta('-- creating file'));
  sh.cp(`${basePath}/config/templates/server/models/_Structure.js`, `${schemaFile}`);
  templateRename(schemaRoot, schemaName);
}

module.exports = createSchema;
