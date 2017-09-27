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

module.exports = { dirExists, delDir, templateRename };
