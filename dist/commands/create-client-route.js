const chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  { templateRename } = require('../utils'),
  basePath = process.env.PWD;

let compOpts = {},
  routes;

function createClientRoute(obj)
{
  compOpts = { ...obj };

  routes = fs.readFileSync(`${basePath}/client/routes.js`, 'utf8');
  routes = routes.match(/routes:.*[\s\S]*.?][^;]/g);
  routes = routes[0].slice(0, -2);// .replace(/[\s]?\/\/.*[\s]?./g,'');

  console.log('');
  console.log(chalk.green.bgBlackBright.bold(' configuring route  %s '), compOpts.type);

  const fullRoutes = (!obj.parentContainer.length)
    ? addRootRoute()
    : addNestedRoute();

  fs.writeFileSync(`${basePath}/client/routes.js`, fullRoutes);
  console.log(chalk.magenta('-- added to pre-existing routes '));
}

function addRootRoute()
{
  let newRoute = `,{
      path: '${(compOpts.pathOverride) ? compOpts.pathOverride : compOpts.path}',
      exact: ${compOpts.exactPath},
      component: ${compOpts.path.split('/').pop()},`;
  if(compOpts.loadkey.length){ newRoute += `loadDataKey: '${compOpts.loadkey}',`; }
  if(compOpts.loadfnc.length){ newRoute += `loadDataFnc: '${compOpts.loadfnc}'`; }
  newRoute += '}]';

  // console.log(chalk.magenta('-- route configured'));
  routes += newRoute;
  // routes.replace(/][\s\S].*?xz/g,'');
  console.log(chalk.white.bgBlack.bold(' created route object %s '), newRoute);
  return routes;
}

function addNestedRoute()
{

}

module.exports = createClientRoute;
