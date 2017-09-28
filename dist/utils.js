const fs = require('fs'),
  chalk = require('chalk');

const dirExists = function (path)
{
  if(
    !fs.existsSync(`${process.env.PWD}/client/components/${path.split('/').pop()}`)
      &&
    !fs.existsSync(`${process.env.PWD}/client/containers/${path.split('/').pop()}`)
  )
  {
    console.log(chalk.red.bold(' ** Container or Component does not exist. Please add it before the route. ** '));
    console.log(chalk.red(' ** Also, make sure you are at the root of your project. ** '));
    process.exit(1);
  }
};

const delDir = function (path)
{
  let files = [];
  if(fs.existsSync(path))
  {
    files = fs.readdirSync(path);
    files.forEach((file) =>
    {
      const curPath = `${path}/${file}`;
      if(fs.statSync(curPath).isDirectory())
      { // recurse
        delDir(curPath);
      }
      else
      { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

const templateRename = function (path, uc, lc)
{
  let files = [];
  if(fs.existsSync(path))
  {
    files = fs.readdirSync(path);
    files.forEach((file) =>
    {
      const curPath = `${path}/${file}`;
      if(fs.statSync(curPath).isDirectory())
      { // recurse
        templateRename(curPath, uc, lc);
      }
      else
      { // configure template file
        console.log(chalk.magenta(`-- configuring ${file} template`));
        let configuredData = fs.readFileSync(curPath, 'utf8');
        configuredData = configuredData.replace(/Xxx/g, uc);
        configuredData = configuredData.replace(/xxx/g, lc);
        fs.writeFileSync(curPath, configuredData);
      }
    });
  }
};

const nestedPaths = function ()
{
  const pathObj = strToArr(fs.readFileSync(`${process.env.PWD}/client/routes.js`, 'utf8'));
  console.log('objStr:', pathObj, typeof (pathObj), pathObj.routes.length);
};
const strToArr = function (s)
{
  // remove skeleton path comments
  s = s.replace(/\/\/.*/g, ''); //eslint-disable-line

  let objStr = s.match(/{[\s\S].?.*:\sRoot.*[\s\S]*(?=];)/g);
  objStr = objStr[0].trim();
  objStr = objStr.replace(/(\w.*)(?=:\s)/g, '"$1"')// left hand side for JSON.parse
    .replace(/(:\s)('?\/?[\w./:-]*)/g, '$1"$2"')// right hand side for JSON.parse
    .replace(/'/g, '').replace(/""\[/g, '[');// no more single quotes, dangling array brackets
  return JSON.parse(objStr);
};

module.exports = { delDir, dirExists, nestedPaths, templateRename };
