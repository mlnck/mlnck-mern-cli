const chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  { templateRename, verifyUniqueFile } = require('../utils'),
  createSchema = require('./create-schema'),
  basePath = process.env.PWD;

let routeRoot,
  routeFile,
  contRoot,
  contFile,
  baseName;

function createServerRoute(routeObj)
{
  // console.log('routeObj',routeObj);
  // routeObj { createController: true, createSchema: true, path: 'skeletonz' }
  routeRoot = `${basePath}/server/routes`;
  routeFile = `${routeRoot}/${routeObj.path.toLowerCase()}.routes.js`;
  contRoot = `${basePath}/server/controllers`;
  contFile = `${contRoot}/${routeObj.path.toLowerCase()}.controller.js`;
  baseName = routeObj.path;
  verifyUniqueFile(routeFile);

  console.log(chalk.green.bgBlackBright.bold(' creating new server route: %s '), routeObj.path);

  console.log(chalk.magenta('-- creating routes file'));
  sh.cp(`${basePath}/config/templates/server/routes/_Structure.js`, `${routeFile}`);
  templateRename(routeRoot, baseName);

  handleCreateController(routeObj.createController, routeObj.createSchema);
}

function handleCreateController(b, bb)
{
  if(b)
  { // create controller file
    // const controllerFile = `${contRoot}/${baseName.toLowerCase()}.controller.js`;
    let routeFileStr = fs.readFileSync(routeFile, 'utf8');
    routeFileStr = routeFileStr.replace(/.*models.*/g, '');
    fs.writeFileSync(routeFile, routeFileStr);

    console.log(chalk.magenta('-- creating controllers file'));
    sh.cp(`${basePath}/config/templates/server/controllers/_Structure.js`, `${contFile}`);
    if(!bb)
    { // no schema file
      let controllerFileStr = fs.readFileSync(contFile, 'utf8');
      controllerFileStr = controllerFileStr.replace(/import.*[\s\S]*?(?=.)/g, '');
      fs.writeFileSync(contFile, controllerFileStr);
    }
    templateRename(contRoot, baseName);
  }
  else
  { // no controller file
    let routeFileStr = fs.readFileSync(routeFile, 'utf8');
    routeFileStr = routeFileStr.replace(/.*\*.*/g, '')
      .replace(/,\s\w*Cont.*(?=\))/g, `,(req,res)=>{res.status(200).send('${baseName}')}`);
    if(!bb)
    { // add schema file
      routeFileStr = routeFileStr.replace(/.*models.*/g, '');
    }
    templateRename(routeRoot, baseName);
    fs.writeFileSync(routeFile, routeFileStr);
  }

  if(bb){ createSchema(baseName); }
}

module.exports = createServerRoute;
