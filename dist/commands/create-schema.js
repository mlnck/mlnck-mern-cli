const chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  basePath = process.env.PWD;

const compOpts = {};

function createSchema(obj)
{
  console.log('creating', obj);
}

module.exports = createSchema;
