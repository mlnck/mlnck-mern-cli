

let chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  _require = require('../utils'),
  templateRename = _require.templateRename,
  format = _require.format,
  createSchema = require('./create-schema'),
  basePath = process.env.PWD;


let routeRoot = void 0,
  routeFile = void 0,
  contRoot = void 0,
  contFile = void 0,
  baseName = void 0,
  formatted = void 0;

function createServerRoute(routeObj)
{
  // console.log('routeObj',routeObj);
  routeRoot = `${basePath}/server/routes`;
  routeFile = `${routeRoot}/${routeObj.path.toLowerCase()}.routes.js`;
  contRoot = `${basePath}/server/controllers`;
  contFile = `${contRoot}/${routeObj.path.toLowerCase()}.controller.js`;
  baseName = routeObj.path;
  formatted = format(baseName);

  console.log(chalk.green.bgBlackBright.bold(' creating new server route: %s '), routeObj.path);
  console.log('contFile:', formatted);

  console.log(chalk.magenta('-- creating routes file'));
  sh.cp(`${basePath}/config/templates/server/routes/_Structure.js`, `${routeFile}`);
  templateRename(routeRoot, baseName);

  let contRteImp = `import ${formatted.camelcased}Routes from './routes/${formatted.camelcased}.routes';`,
    contImport = `import * as ${formatted.capitalized}Controller from './controllers/${formatted.camelcased}.controller'; // eslint-disable-line`,
    srvrFile = `${basePath}/server/server.js`;
  let srvrFileStr = fs.readFileSync(`${srvrFile}`, 'utf8');

  srvrFileStr = srvrFileStr.replace('Server Side Routes:', `Server Side Routes:\n${contRteImp}\n${contImport}`);
  fs.writeFileSync(srvrFile, srvrFileStr);

  handleCreateController(routeObj.createController, routeObj.createSchema);
}

function handleCreateController(b, bb)
{
  if(b)
  {
    // create controller file
    // const controllerFile = `${contRoot}/${baseName.toLowerCase()}.controller.js`;
    let routeFileStr = fs.readFileSync(routeFile, 'utf8');
    routeFileStr = routeFileStr.replace(/.*models.*/g, '');
    fs.writeFileSync(routeFile, routeFileStr);

    if(!fs.existsSync(contFile))
    {
      // possible that controller was created within create-client-route
      console.log(chalk.magenta('-- creating controllers file'));
      sh.cp(`${basePath}/config/templates/server/controllers/_Structure.js`, `${contFile}`);
    }

    if(!bb)
    {
      // no schema file
      let controllerFileStr = fs.readFileSync(contFile, 'utf8');
      controllerFileStr = controllerFileStr.replace(/import.*[\s\S]*?(?=.)/g, '');
      fs.writeFileSync(contFile, controllerFileStr);
    }
    templateRename(contRoot, baseName);
  }
  else
  {
    // no controller file
    let _routeFileStr = fs.readFileSync(routeFile, 'utf8');
    _routeFileStr = _routeFileStr.replace(/.*\*.*/g, '').replace(/,\s\w*Cont.*(?=\))/g, `,(req,res)=>{res.status(200).send('${baseName}')}`);
    if(!bb)
    {
      // add schema file
      _routeFileStr = _routeFileStr.replace(/.*models.*/g, '');
    }
    templateRename(routeRoot, baseName);
    fs.writeFileSync(routeFile, _routeFileStr);
  }

  if(bb)
  {
    createSchema(baseName);
  }
}

module.exports = createServerRoute;
