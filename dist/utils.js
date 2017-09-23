const fs = require('fs');

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

module.exports = { delDir };
