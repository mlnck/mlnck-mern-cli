const chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  { templateRename,verifyUniqueFile } = require('../utils'),
  basePath = process.env.PWD;

const compOpts = {};

function createSchema(schemaName)
{
  const schemaRoot = `${basePath}/server/models`,
        schemaFile = `${schemaRoot}/${schemaName}.js`;
  verifyUniqueFile(schemaFile);
  
  console.log('creating schema', schemaName, schemaRoot);
  console.log(chalk.green.bgBlackBright.bold(' creating new schema: %s '), schemaName);
  //templateRename(compOpts.destDir, compOpts.nameCapitalized, compOpts.nameLowercase);
}

// function createFile()
// {
//   if(fs.existsSync(compOpts.destDir))
//   {
//     console.log(' ');
//     console.log(chalk.red.bold.underline(`** ${compOpts.nameCapitalized} ${compOpts.type} already exits! Please give the ${compOpts.type} a unique name **`));
//     console.log(' ');
//     process.exit(1);
//   }
//   console.log(chalk.magenta(`-- creating ${compOpts.type} folder`));
//   sh.mkdir('-p', compOpts.destDir);
//
//   console.log(chalk.magenta('-- creating file'));
//   sh.cp(`${compOpts.templatePath}index.js`, `${compOpts.destDir}index.js`);
//
//   sh.cd(compOpts.destDir);
//   console.log(chalk.magenta('configuring template name: '));
//   if(fs.statSync(`${compOpts.destDir}index.js`).isFile())
//   {
//     let configuredData = fs.readFileSync(`${compOpts.destDir}index.js`, 'utf8');
//     if(compOpts.stateful)
//     {
//       console.log(chalk.magenta('-- with state: '));
//       configuredData = configuredData.replace(/[\s]?export\sd.*fun.*/g, '');
//     }
//     else
//     {
//       console.log(chalk.magenta('-- without state: '));
//       configuredData = configuredData.replace(/class\sXxx.*React.Component/g, '');
//       configuredData = configuredData.replace(/export\sfu[\s\S]*.?/g, '');
//     }
//     fs.writeFileSync(`${compOpts.destDir}index.js`, configuredData);
//   }
//   handleActions();
// }

module.exports = createSchema;
