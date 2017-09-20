var chalk = require('chalk'),
    fs = require('fs'),
    path = require('path');

var removeSample = function()
{
  console.log(chalk.green.bgBlackBright.bold(' removing sample project '));
}

module.exports = removeSample;
