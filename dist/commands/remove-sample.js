'use strict'

const chalk = require('chalk'),
    fs = require('fs'),
    path = require('path');

let basePath = process.env.PWD,
    pagesWithSampleOutput = [],
    rmrf = [];

function removeSample()
{
  console.log(chalk.green.bgBlackBright.bold(' removing sample project '));
  pagesWithSampleOutput =
    [
      '/client/containers/Home/index.js',
      '/client/containers/Root/index.js',
      '/client/index.js', '/client/reducers.js', '/client/routes.js', '/client/store.js',
      '/config/templates/client/containers/_Structure/index.js',
      '/config/utils/server/seed.db.js',
      '/server/server.js'
    ];
  rmrf =
    [
      '/client/containers/Skeleton/',
      '/server/controllers/__tests__/skeleton.spec.js',
      '/server/controllers/skeleton.controller.js',
      '/server/models/skeleton.js',
      '/server/routes/skeleton.routes.js'
    ];

  removeTextFromFiles(pagesWithSampleOutput.pop())
}

function removeTextFromFiles(s)
{
  console.log(chalk.magenta('removing sample markup from: ')+chalk.underline(s));
  if( fs.statSync(basePath+s).isFile() )
  {
    let strippedData = fs.readFileSync(basePath+s,'utf8');
    strippedData = strippedData.replace(/\/\*\* s.*[\s\S]*?end_.*\*\//g,'');
    fs.writeFileSync(basePath+s,strippedData);
  }

  if(pagesWithSampleOutput.length)
  { removeTextFromFiles(pagesWithSampleOutput.pop()); }
  else
  {
    console.log(chalk.inverse(' removed internal markup, moving on '));
    removeSampleElements(rmrf.pop());
  }
};

function removeSampleElements(s)
{
  console.log(chalk.magenta('removing sample file/directory: ')+chalk.underline(s));

  if( fs.statSync(basePath+s).isFile() )
  { fs.unlinkSync(basePath+s); }

  if( fs.statSync(basePath+s).isDirectory() )
  { fs.rmdirSync(basePath+s); }

  if(rmrf.length)
  { removeSampleElements(rmrf.pop()); }
  else
  {
    console.log(chalk.inverse(' removed sample elements, script complete '));
    process.exit(0);
  }
}


module.exports = removeSample;
