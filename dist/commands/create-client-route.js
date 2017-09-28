const chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  basePath = process.env.PWD;

let compOpts = {},
  routes;

function createClientRoute(obj)
{
  compOpts = { ...obj };
  console.log('compOpts:', compOpts);

  routes = fs.readFileSync(`${basePath}/client/routes.js`, 'utf8');

  console.log('');
  console.log(chalk.green.bgBlackBright.bold(' configuring route  %s '), compOpts.path);

  routes = addRouteImport();

  const fullRoutes = (!obj.parentContainer.length)
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
    console.log(chalk.red.bold(' ** Container or Component is already being imported. ** '));
    console.log(chalk.red(' ** Please resolve this issue before proceeding. ** '));
    process.exit(1);
  }

  return insertIntoRoutes(importAt, `${importStr}\n\n`);
}

function addRootRoute()
{
  let newRoute = `,{
      path: '${(compOpts.pathOverride) ? compOpts.pathOverride : compOpts.path}',
      exact: ${compOpts.exactPath},
      component: ${(compOpts.containerNameOverride) ? compOpts.containerNameOverride : compOpts.path.split('/').pop()}`;
  if(compOpts.loadkey){ newRoute += `,\nloadDataKey: '${compOpts.loadkey}',`; }
  if(compOpts.loadfnc){ newRoute += `\nloadDataFnc: '${compOpts.loadfnc}'`; }
  newRoute += '}\n';

  const newRouteObj = insertIntoRoutes(routes.lastIndexOf(']// root routes'), newRoute);

  console.log(chalk.magenta('-- route configured'));
  console.log(chalk.white.bgBlack.bold(' created route object\n%s '), newRoute);
  return newRouteObj;
}

function addNestedRoute()
{

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
