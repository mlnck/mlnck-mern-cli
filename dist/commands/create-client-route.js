const chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  { format, templateRename } = require('../utils'),
  basePath = process.env.PWD;

let compOpts = {},
  routes;

function createClientRoute(obj)
{
  compOpts = { ...obj };

  const curComponent = (compOpts.containerNameOverride)
    ? compOpts.containerNameOverride
    : compOpts.path.split('/').pop();
  compOpts.curComponent = curComponent;

  compOpts.destDir = `${basePath}/server/controllers`;
  compOpts.format = format(compOpts.curComponent);

  if(compOpts.loadcontroller !== 'null')
  { handleServerSide(); }
  else
  { handleClientRoute(compOpts); }
}
function handleServerSide()
{
  console.log('');
  console.log(chalk.green.bgBlackBright.bold(' configuring route  %s '), compOpts.path);

  if(!fs.existsSync(`${basePath}/server/controllers/${compOpts.loadcontroller}`))
  {
    sh.cp(`${basePath}/config/templates/server/controllers/_Structure.js`,
      `${compOpts.destDir}/${compOpts.loadcontroller}`);

    console.log(chalk.magenta('-- added controller file '));

    if(compOpts.loadfnc)
    {
      let cntrlr = fs.readFileSync(`${compOpts.destDir}/${compOpts.loadcontroller}`, 'utf8');
      cntrlr = cntrlr.replace('xxx(', `${compOpts.loadfnc}(`);
      fs.writeFileSync(`${compOpts.destDir}/${compOpts.loadcontroller}`, cntrlr);

      console.log(chalk.magenta('-- added controller method '));
    }
    templateRename(compOpts.destDir, compOpts.format.capitalized, compOpts.format.camelcased);
  }
  else
  if(compOpts.loadfnc)
  {
    let cntrlr = fs.readFileSync(`${compOpts.destDir}/${compOpts.loadcontroller}`, 'utf8');
    cntrlr += `\n\nexport function ${compOpts.loadfnc}(req, res)\n{ res.status(200).send('${compOpts.format.capitalized}'); }`;
    fs.writeFileSync(`${compOpts.destDir}/${compOpts.loadcontroller}`, cntrlr);

    console.log(chalk.magenta('-- added controller method '));
  }

  if(compOpts.createSchemaDne)
  {
    sh.cp(`${basePath}/config/templates/server/models/_Structure.js`,
      `${compOpts.destDir.replace('controllers', 'models')}/${compOpts.loadcontroller.replace('.controller.js', '.model.js')}`);
    templateRename(compOpts.destDir.replace('controllers', 'models'), compOpts.format.capitalized, compOpts.format.camelcased);
    console.log(chalk.magenta('-- added schema file '));
  }
  else
  {
    let cntrlr = fs.readFileSync(`${compOpts.destDir}/${compOpts.loadcontroller}`, 'utf8');
    cntrlr = cntrlr.replace(/imp.*[\s\S].?/g, '');// remove import model from controller
    fs.writeFileSync(`${compOpts.destDir}/${compOpts.loadcontroller}`, cntrlr);
  }

  handleClientRoute(compOpts);
}

function handleClientRoute(obj)
{
  routes = fs.readFileSync(`${basePath}/client/routes.js`, 'utf8');

  console.log('');
  console.log(chalk.green.bgBlackBright.bold(' configuring route  %s '), compOpts.path);

  routes = addRouteImport();

  const fullRoutes = (!obj.hasParent)
    ? addRootRoute()
    : addNestedRoute();

  fs.writeFileSync(`${basePath}/client/routes.js`, fullRoutes);
  console.log(chalk.magenta('-- added to pre-existing routes '));
  tidyRoutes();
}

function addRouteImport()
{
  console.log(chalk.magenta('-- importing component into routes file'));
  const curComponent = (compOpts.containerNameOverride)
      ? compOpts.containerNameOverride
      : compOpts.path.split('/').pop(),
    importLoc = (fs.existsSync(`${process.env.PWD}/client/containers/${curComponent}`))
      ? `./containers/${curComponent}`
      : `./components/${curComponent}`,
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
  let newRoute = `,{
      path: '${(compOpts.pathOverride) ? compOpts.pathOverride : compOpts.path}',
      exact: ${compOpts.exactPath},
      component: ${(compOpts.containerNameOverride) ? compOpts.containerNameOverride : compOpts.path.split('/').pop()}`;
  if(compOpts.loadcontroller !== 'null'){ newRoute += `,\nloadDataKey: '${compOpts.loadcontroller}',`; }
  if(compOpts.loadfnc){ newRoute += `\nloadDataFnc: '${compOpts.loadfnc}'`; }
  newRoute += '}\n';

  const newRouteObj = insertIntoRoutes(routes.lastIndexOf(']// root routes'), newRoute);

  console.log(chalk.magenta('-- route configured'));
  console.log(chalk.white.bgBlack.bold(' created route object\n%s '), newRoute);
  return newRouteObj;
}

function addNestedRoute()
{
  console.log(chalk.magenta('-- locating parent route '));

  const newPath = (compOpts.pathOverride) ? compOpts.pathOverride : compOpts.path;
  let newRoute = `{
          path: '${newPath}',
          exact: ${compOpts.exactPath},
          component: ${(compOpts.containerNameOverride) ? compOpts.containerNameOverride : compOpts.path.split('/').pop()}`;
  if(compOpts.loadcontroller){ newRoute += `,\nloadDataKey: '${compOpts.loadcontroller}',`; }
  if(compOpts.loadfnc){ newRoute += `\nloadDataFnc: '${compOpts.loadfnc}'`; }
  newRoute += '}\n';

  const parentContainerArray = compOpts.parentContainer.replace(/\/:/g, '~!~').split('/'),
    closingRegex = (parentContainerArray.length > 2) ? ').*[\\s\\S]*?(?=})' : '.*[\\s\\S]*?(?=})',
    // [\s\S]*Hanger.*[\s\S]*?(HangerNest).*[\s\S]*?(?=})
    regexPath = new RegExp(parentContainerArray
      .join('){1}(\\/)?.*[\\s\\S]*?(')
      .replace(/~!~/g, '/:')
          .replace('){1}(\\/)?.*[\\s\\S]*?', '').replace('(','[\\s\\S]*').replace('){1}(\\/)?','') //eslint-disable-line
      .concat(closingRegex), 'g');
  // console.log('regexPath:', regexPath);

  const nestedPathMatch = routes.match(regexPath);

  // Because node does not support .test() with regex we have to use a bit of a workaround
  // step1 - find path in routes
  // step2 - add unique way to find location
  // step3 - get full containing "object"
  // step4 - check for indexof routes

  const matchedLen = nestedPathMatch[0].length,
    hash = new Date().getTime(),
    rteWithHash = insertIntoRoutes(matchedLen, hash),
    pathObjStr = rteWithHash.match(new RegExp(`${hash}.*[\\s\\S]*?}`, 'g')),
    hasChildRoutes = (!!~pathObjStr[0].indexOf('routes: ['));
  console.log(chalk.magenta(`-- parent ${(hasChildRoutes) ? 'has' : 'does not have'} pre-existing child route(s) `));
  // console.log('rteWithHash:', rteWithHash);
  let insertAt = nestedPathMatch[0].length;
  // let insertAt = nestedPathMatch[0].length + 1;
  if(!hasChildRoutes)
  { newRoute = `,routes: [{${newRoute.substr(1)}]`; }
  else
  {
    insertAt += (pathObjStr[0].indexOf('routes: [') - 1);
    newRoute += ',';
  }

  const newRouteObj = insertIntoRoutes(insertAt, newRoute);

  console.log(chalk.magenta('-- route configured'));
  console.log(chalk.white.bgBlack.bold(' created route object\n%s '), newRoute);
  // console.log(newRouteObj);
  return newRouteObj;
}

function insertIntoRoutes(i, s)
{ return routes.substring(0, i) + s + routes.substr(i - routes.length); }

function tidyRoutes()
{
  console.log(chalk.magenta('-- tidying up generated code '));
  return (sh.which('yarn'))
    ? sh.exec(`yarn eslint --fix ${basePath}/client/routes.js`)
    : sh.exec(`npm run eslint --fix ${basePath}/client/routes.js`);
}

module.exports = createClientRoute;
