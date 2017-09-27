const chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  { templateRename } = require('../utils'),
  basePath = process.env.PWD;

let compOpts = {};

function createClientRoute(path, container, exact, parentContainer, loadkey, loadfnc)
{
  compOpts = { path, container, exact, parentContainer, loadkey, loadfnc };
  console.log('compOpts:', compOpts);
}

module.exports = createClientRoute;
