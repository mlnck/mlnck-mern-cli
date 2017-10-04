const chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  basePath = process.env.PWD;

function createServerRoute(obj)
{
  console.log('createServerRoute: obj:', obj);
}

module.exports = createServerRoute;
