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

  const fullRoutes = (!obj.hasParent)
    ? addRootRoute()
    : addNestedRoute();

  console.log('RE-ENABLE THE BELOW LINE TO WRITE TO FILE!!!!!');
  console.log('RE-ENABLE THE BELOW LINE TO WRITE TO FILE!!!!!');
  console.log('RE-ENABLE THE BELOW LINE TO WRITE TO FILE!!!!!');
/*  fs.writeFileSync(`${basePath}/client/routes.js`, fullRoutes);
  console.log(chalk.magenta('-- added to pre-existing routes '));
  tidyRoutes(); */
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
  console.log('ADDING NESTED');
  let newRoute = `,{
      path: '${(compOpts.pathOverride) ? compOpts.pathOverride : compOpts.path}',
      exact: ${compOpts.exactPath},
      component: ${(compOpts.containerNameOverride) ? compOpts.containerNameOverride : compOpts.path.split('/').pop()}`;
  if(compOpts.loadkey){ newRoute += `,\nloadDataKey: '${compOpts.loadkey}',`; }
  if(compOpts.loadfnc){ newRoute += `\nloadDataFnc: '${compOpts.loadfnc}'`; }
  newRoute += '}\n';

  // match on nested route, and regex the end point for use with lastIndexOf
  console.log('compOpts.parentContainer:', compOpts.parentContainer);
  const regexPath = new RegExp(compOpts.parentContainer
    .split('/')
    .join('.*[\\s\\S]*?\\/')
    .replace('.*[\s\S]*?', '') //eslint-disable-line
    .concat('.*[\\s\\S]*?(?=})'), 'g');
  console.log('regexPath:', regexPath);

  /// \/skeleton2.*[\s\S]*?\/xxx2.*[\s\S]*?\/:xyz.*[\s\S]*?\/zzz1.*[\s\S]*?\/:cidx.*[\s\S]*?(?=})
  const nestedPathMatch = routes.match(regexPath);
  console.log('nestedPathMatch:', nestedPathMatch);
  console.log('lastIndexOf(regexPath:', routes.lastIndexOf(nestedPathMatch[0]), nestedPathMatch[0].length);
  // ---      .*[\s\S]*?\/
  /// /    ---   \/skeleton2.*[\s\S]*?\/xxx2.*[\s\S]*?\/:xyz.*[\s\S]*?\/zzz1.*[\s\S]*?\/:cidx

  // Need to check to see if routes:[] key already exists on this object(already has nested routes)
  // and add to it
  /* OR */
  // Need to add routes:[] key to the object (first nested route)
  const newRouteObj = insertIntoRoutes(nestedPathMatch[0].length, newRoute);

  // console.log(chalk.magenta('-- route configured'));
  console.log(chalk.white.bgBlack.bold(' created route object\n%s '), newRoute);
  console.log(newRouteObj);
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
