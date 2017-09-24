const chalk = require('chalk'),
  fs = require('fs'),
  sh = require('shelljs'),
  basePath = process.env.PWD;

const compOpts = {};

function createClient(t, n, s, r, d, sa, st)
{
  const tmpNameFirst = n.charAt(0).toUpperCase();

  compOpts.type = t,
  compOpts.stateful = s;
  compOpts.route = r;
  compOpts.dispatch = d;
  compOpts.saga = sa;
  compOpts.styled = st;
  compOpts.nameCapitalized = tmpNameFirst + n.substr(1);
  compOpts.nameLowercase = n.toLowerCase();
  console.log('compOpts:', compOpts);
}

function createFile()
{
  // template in folder
  // export function vs class( function vs export connect )
}

function createAction()
{
  // opt- create actions - constants - reducer files
  // opt- create saga listener
  // opt- js styling
}

function createRoute()
{
  // opt- route
  // sh.exec('croute compOpts.nameLowercase ')
}

module.exports = createClient;
