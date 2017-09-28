const chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  basePath = process.env.PWD;

let compOpts = {},
  routes;

function createClientRoute(obj)
{
  compOpts = { ...obj };

  routes = fs.readFileSync(`${basePath}/client/routes.js`, 'utf8');

  console.log('');
  console.log(chalk.green.bgBlackBright.bold(' configuring route  %s '), compOpts.path);

  const fullRoutes = (!obj.parentContainer.length)
    ? addRootRoute()
    : addNestedRoute();

  fs.writeFileSync(`${basePath}/client/routes.js`, fullRoutes);
  console.log(chalk.magenta('-- added to pre-existing routes '));
  tidyRoutes();
}

function addRootRoute()
{
  let newRoute = `,{
      path: '${(compOpts.pathOverride) ? compOpts.pathOverride : compOpts.path}',
      exact: ${compOpts.exactPath},
      component: ${compOpts.path.split('/').pop()}`;
  if(compOpts.loadkey.length){ newRoute += `,\nloadDataKey: '${compOpts.loadkey}',`; }
  if(compOpts.loadfnc.length){ newRoute += `\nloadDataFnc: '${compOpts.loadfnc}'`; }
  newRoute += '}\n';

  const newRouteObj = routes.substring(0, routes.lastIndexOf('];')) +
                    newRoute +
                    routes.substr(routes.lastIndexOf('];') - routes.length);

  console.log(chalk.magenta('-- route configured'));
  console.log(chalk.white.bgBlack.bold(' created route object\n%s '), newRoute);
  return newRouteObj;
}

function addNestedRoute()
{

}

function tidyRoutes()
{
  console.log(chalk.magenta('-- tidying up generated code '));
  return (sh.which('yarn'))
    ? sh.exec(`yarn eslint --fix ${basePath}/client/routes.js`)
    : sh.exec(`npm run eslint --fix ${basePath}/client/routes.js`);
}

module.exports = createClientRoute;
