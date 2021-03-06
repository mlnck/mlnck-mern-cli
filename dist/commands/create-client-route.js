

const _extends = Object.assign || function (target){ for(let i = 1; i < arguments.length; i++){ const source = arguments[i]; for(const key in source){ if(Object.prototype.hasOwnProperty.call(source, key)){ target[key] = source[key]; } } } return target; };

let chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  _require = require('../utils'),
  format = _require.format,
  templateRename = _require.templateRename,
  createSchema = require('./create-schema'),
  basePath = process.env.PWD;


let compOpts = {},
  routes = void 0;

function createClientRoute(obj)
{
  compOpts = _extends({}, obj);

  const curComponent = compOpts.containerNameOverride ? compOpts.containerNameOverride : compOpts.path.split('/').pop();
  compOpts.curComponent = curComponent;

  compOpts.destDir = `${basePath}/server/controllers`;
  compOpts.format = format(compOpts.curComponent);

  if(compOpts.loadcontroller !== 'null')
  {
    const baseName = compOpts.loadcontroller.split('.');
    compOpts.serverFormat = format(baseName[0]);
    handleServerSide();
  }
  else
  {
    handleClientRoute(compOpts);
  }
}
function handleServerSide()
{
  console.log('');
  console.log(chalk.green.bgBlackBright.bold(' configuring route  %s '), compOpts.path);

  if(!fs.existsSync(`${basePath}/server/controllers/${compOpts.loadcontroller}`))
  {
    sh.cp(`${basePath}/config/templates/server/controllers/_Structure.js`, `${compOpts.destDir}/${compOpts.loadcontroller}`);

    console.log(chalk.magenta('-- added controller file '));

    if(compOpts.loadfnc)
    {
      let cntrlr = fs.readFileSync(`${compOpts.destDir}/${compOpts.loadcontroller}`, 'utf8');
      cntrlr = cntrlr.replace(/export.*[\s\S]*?}/g, `export function ${compOpts.loadfnc}(o){ return 'xxx'; }`);
      fs.writeFileSync(`${compOpts.destDir}/${compOpts.loadcontroller}`, cntrlr);

      console.log(chalk.magenta('-- added controller method '));
    }
    templateRename(compOpts.destDir, compOpts.serverFormat.capitalized, compOpts.serverFormat.camelcased);
  }
  else if(compOpts.loadfnc)
  {
    let _cntrlr = fs.readFileSync(`${compOpts.destDir}/${compOpts.loadcontroller}`, 'utf8');
    _cntrlr += `\n\nexport function ${compOpts.loadfnc}(req, res)\n{ res.status(200).send('${compOpts.serverFormat.capitalized}'); }`;
    fs.writeFileSync(`${compOpts.destDir}/${compOpts.loadcontroller}`, _cntrlr);

    console.log(chalk.magenta('-- added controller method '));
  }

  if(compOpts.createSchemaDne)
  {
    if(fs.existsSync(`${basePath}/server/models/${compOpts.loadcontroller.replace('controller', 'model')}`))
    {
      console.log(chalk.magenta('-- pre-existing schema file. Did not create. '));
    }
    else
    {
      createSchema(compOpts.serverFormat.camelcased);
    }
  }
  else
  {
    let _cntrlr2 = fs.readFileSync(`${compOpts.destDir}/${compOpts.loadcontroller}`, 'utf8');
    _cntrlr2 = _cntrlr2.replace(/imp.*[\s\S].?/g, ''); // remove import model from controller
    fs.writeFileSync(`${compOpts.destDir}/${compOpts.loadcontroller}`, _cntrlr2);
  }

  handleClientRoute(compOpts);
}

function handleClientRoute(obj)
{
  routes = fs.readFileSync(`${basePath}/client/routes.js`, 'utf8');

  console.log('');
  console.log(chalk.green.bgBlackBright.bold(' configuring route  %s '), compOpts.path);

  routes = addRouteImport();

  const fullRoutes = !obj.hasParent ? addRootRoute() : addNestedRoute();

  fs.writeFileSync(`${basePath}/client/routes.js`, fullRoutes);
  console.log(chalk.magenta('-- added to pre-existing routes '));
  tidyRoutes();
}

function addRouteImport()
{
  console.log(chalk.magenta('-- importing component into routes file'));
  let curComponent = compOpts.containerNameOverride ? compOpts.containerNameOverride : compOpts.path.split('/').pop(),
    importLoc = fs.existsSync(`${process.env.PWD}/client/containers/${curComponent}`) ? `./containers/${curComponent}` : `./components/${curComponent}`,
    importAt = routes.indexOf('export default') - 2,
    importStr = `import ${curComponent} from '${importLoc}';`;

  if(~routes.indexOf(importStr))
  {
    // component is already imported, no need to re-add
    return routes;
  }

  return insertIntoRoutes(importAt, `${importStr}\n\n`);
}

function addRootRoute()
{
  console.log('compOpts:', compOpts);
  let newRoute = `,{\n      path: '${compOpts.pathOverride ? compOpts.pathOverride : compOpts.path}',\n      exact: ${compOpts.exactPath},\n      component: ${compOpts.containerNameOverride ? compOpts.containerNameOverride : compOpts.path.split('/').pop()}`;
  const loadControllerFrist = compOpts.loadcontroller.charAt(0);
  let loadControllerStr = compOpts.loadcontroller.split('.');
  loadControllerStr = loadControllerStr[0];
  console.log('loadControllerStr1:', loadControllerStr);
  loadControllerStr = loadControllerFrist.toUpperCase() + loadControllerStr.substr(1);
  console.log('loadControllerStr2:', loadControllerStr);
  if(compOpts.loadkey)
  {
    newRoute += `,\nloadDataKey: '${compOpts.loadkey}',`;
  }
  if(compOpts.loadfnc)
  {
    newRoute += `\nloadDataFnc: '${loadControllerStr}Controller.${compOpts.loadfnc}'`;
  }
  newRoute += '}\n';

  const newRouteObj = insertIntoRoutes(routes.lastIndexOf(']// root routes'), newRoute);

  console.log(chalk.magenta('-- route configured'));
  console.log(chalk.white.bgBlack.bold(' created route object\n%s '), newRoute);
  return newRouteObj;
}

function addNestedRoute()
{
  console.log(chalk.magenta('-- locating parent route '));

  const newPath = compOpts.pathOverride ? compOpts.pathOverride : compOpts.path;
  let newRoute = `{\n          path: '${newPath.toLowerCase()}',\n          exact: ${compOpts.exactPath},\n          component: ${compOpts.containerNameOverride ? compOpts.containerNameOverride : compOpts.path.split('/').pop()}`;
  const loadControllerFrist = compOpts.loadcontroller.charAt(0);
  let loadControllerStr = compOpts.loadcontroller.split('.');
  loadControllerStr = loadControllerStr[0];
  console.log('loadControllerStr1:', loadControllerStr);
  loadControllerStr = loadControllerFrist.toUpperCase() + compOpts.loadcontroller.substr(1);
  console.log('loadControllerStr2:', loadControllerStr);
  if(compOpts.loadkey)
  {
    newRoute += `,\nloadDataKey: '${compOpts.loadkey}',`;
  }
  if(compOpts.loadfnc)
  {
    newRoute += `\nloadDataFnc: '${loadControllerStr}Controller.${compOpts.loadfnc}'`;
  }
  newRoute += '}\n';

  let parentContainerArray = compOpts.parentContainer.replace(/\/:/g, '~!~').split('/'),
    closingRegex = parentContainerArray.length > 2 ? ').*[\\s\\S]*?(routes.*\\[|(?=}))' : '\\\'.*',
      regexPath = new RegExp(parentContainerArray.join('){1}(\\/)?.*[\\s\\S]*?(').replace(/~!~/g, '/:').replace('){1}(\\/)?.*[\\s\\S]*?', '').replace('(', '[\\s\\S]*').replace('){1}(\\/)?', '') //eslint-disable-line
      .concat(closingRegex), 'g');
  // console.log('regexPath:', regexPath);


  const nestedPathMatch = routes.match(regexPath);

  // Because node does not support .test() with regex we have to use a bit of a workaround
  // step1 - find path in routes
  // step2 - add unique way to find location
  // step3 - get full containing "object"
  // step4 - check for indexof routes

  let matchedLen = nestedPathMatch[0].length,
    hash = new Date().getTime(),
    rteWithHash = insertIntoRoutes(matchedLen, hash),

    // use this to determine if the current route already has children routes
    // (colon to allow "root route" comment to have no issues)
    pathObjStr = rteWithHash.match(new RegExp(`${hash}.*[\\s\\S]*?(path|routes:|]\\/\\/.*root)`, 'g')),
    hasChildRoutes = !!~pathObjStr[0].indexOf('routes:');
  console.log(chalk.magenta(`-- parent ${hasChildRoutes ? 'has' : 'does not have'} pre-existing child route(s) `));
  // console.log('rteWithHash:', rteWithHash);
  // console.log('\n\n');
  // console.log('pathObjStr[0]:', `${hash}.*[\\s\\S]*?(path|routes:)`, '|||', pathObjStr[0]);
  let insertAt = nestedPathMatch[0].length;
  if(!hasChildRoutes)
  {
    const noChildInsertAt = rteWithHash.match(new RegExp(`[\\s\\S]*\\w*:.*${hash}[\\s\\S]*?}`, 'g'));
    insertAt = noChildInsertAt[0].length - String(hash).length - 1;
    newRoute = `,routes: [{${newRoute.substr(1)}]`;
  }
  else
  {
    const withChildInsertAt = rteWithHash.match(new RegExp(`[\\s\\S]*\\w.*${hash}[\\s\\S]*?routes.*\\[`, 'g'));
    insertAt = withChildInsertAt[0].length - String(hash).length;

    newRoute += ',';
  }

  const newRouteObj = insertIntoRoutes(insertAt, newRoute);

  console.log(chalk.magenta('-- route configured'));
  console.log(chalk.white.bgBlack.bold(' created route object\n%s '), newRoute);

  return newRouteObj;
}

function insertIntoRoutes(i, s)
{
  return routes.substring(0, i) + s + routes.substr(i - routes.length);
}

function tidyRoutes()
{
  console.log(chalk.magenta('-- tidying up generated code '));

  const serverPath = compOpts.pathOverride ? compOpts.pathOverride.replace('/', '') : compOpts.path.replace('/', '');

  console.log(chalk.black.bold.bgYellow(' If server side routes are needed, run:    '));
  console.log(chalk.black.bold.bgYellow(`\t$ mlnck-mern sroute ${serverPath} `));

  return sh.which('yarn') ? sh.exec(`yarn eslint --fix ${basePath}/client/routes.js`) : sh.exec(`npm run eslint --fix ${basePath}/client/routes.js`);
}

module.exports = createClientRoute;
