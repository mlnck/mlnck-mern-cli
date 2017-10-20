const chalk = require('chalk'),
  fs = require('fs'),
  { delDir } = require('../utils'),
  basePath = process.env.PWD;

let pagesWithSampleOutput = [],
  rmrf = [];

function removeSample()
{
  console.log(chalk.green.bgBlackBright.bold(' removing sample project '));
  pagesWithSampleOutput =
    [
      '/client/components/Header/index.js',
      '/client/containers/Home/index.js',
      '/client/containers/Root/index.js',
      '/client/index.js', '/client/reducers.js', '/client/routes.js', '/client/store.js',
      '/config/server/basehtml.js',
      '/config/templates/client/components/_Structure/index.js',
      '/config/templates/client/containers/_Structure/index.js',
      '/config/utils/server/seed.db.js',
      '/config/utils/server/test-helpers.js',
      '/server/server.js',
      '/client/_scss/main.scss', '/client/_scss/base/_main-settings.scss'
    ];
  rmrf =
    [
      '/client/components/Closet/',
      '/client/containers/Skeleton/',
      '/server/controllers/__tests__/skeleton.spec.js',
      '/server/controllers/skeleton.controller.js',
      '/server/models/skeleton.js',
      '/server/routes/skeleton.routes.js'
    ];

  removeTextFromFiles(pagesWithSampleOutput.pop());
}

function removeTextFromFiles(s)
{
  console.log(chalk.magenta('removing sample markup from: ') + chalk.underline(s));
  if(fs.statSync(basePath + s).isFile())
  {
    let strippedData = fs.readFileSync(basePath + s, 'utf8');
    strippedData = strippedData.replace(/,\s.*{.*'\/s.*[\s\S]*?][\s\S]*?}/g, '');// clean up routes
    strippedData = strippedData.replace("navTitle: 'Skeleton Default',", "navTitle: 'Mlnck Mern',");// one off for header component
    strippedData = strippedData.replace(/.*skeleton.*[\s\S]*bark.*[\s\S].;/g, '');// one off for helper tests
    strippedData = strippedData.replace(/.*ton\.crea*[\s\S]*?}\);/g, '');// one off for helper tests
    strippedData = strippedData.replace(/\/\*\* s.*[\s\S]*?end_.*\*\//g, ''); // remove commented sections
    strippedData = strippedData.replace(/<d.*optional-helper-text[\s\S]*?v>/g, ''); // remove skeleton divs
    strippedData = strippedData.replace(/<st.*[\s\S]*optional-helper-text[\s\S]*?e>/g, ''); // remove skeleton styles
    fs.writeFileSync(basePath + s, strippedData);
  }

  if(pagesWithSampleOutput.length)
  { removeTextFromFiles(pagesWithSampleOutput.pop()); }
  else
  {
    console.log(chalk.inverse(' removed internal markup, moving on '));
    removeSampleElements(rmrf.pop());
  }
}

function removeSampleElements(s)
{
  console.log(chalk.magenta('removing sample file/directory: ') + chalk.underline(s));

  if(fs.existsSync(basePath + s) && fs.statSync(basePath + s).isFile())
  { fs.unlinkSync(basePath + s); }

  if(fs.existsSync(basePath + s) && fs.statSync(basePath + s).isDirectory())
  { delDir(basePath + s); }

  if(rmrf.length)
  { removeSampleElements(rmrf.pop()); }
  else
  {
    console.log(chalk.inverse(' SUCCESSFUL: removed sample elements '));
  }
}


module.exports = removeSample;
