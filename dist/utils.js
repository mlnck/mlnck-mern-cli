const fs = require('fs'),
  chalk = require('chalk');

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

module.exports = { delDir, templateRename };
