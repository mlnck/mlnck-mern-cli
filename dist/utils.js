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
  //this function is here to allow customized finessing for each obj if  we end up reusing strToArr
  return strToArr(fs.readFileSync(`${process.env.PWD}/client/routes.js`, 'utf8'));
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
const recursiveWalk(a,k,v,s)
{
  //loops through (a)rray, everytime (k)ey is hit, (v)alue is pushed to a new array.
    //if v is nested, then it is appended to all prev v before it, with a (s)eperator string:
      /*
        [
          {key : 1},
          {key : 2},
          {
            key : 3,
            arr : [{ key: 3a}]
          }
        ]
        //OUTPUT: [1,2,3,33a]
      */
}

module.exports = { delDir, dirExists, nestedPaths, templateRename };
