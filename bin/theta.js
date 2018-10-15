#!/usr/bin/env node

process.env.NODE_PATH = __dirname + '/../node_modules/';
const { resolve } = require('path');
const command_path = command => resolve(__dirname, '../commands/', command);
const program = require('commander')    //命令行工具    https://github.com/tj/commander.js
const pkg = require('../package.json');

program.version(pkg.version);

program.usage('<command>');

program.command('init')
  .description('create a new project')
  .alias('i')
  .option('-y, --yes', 'Use default values All')
  .option('-t, --template [templateName]', 'Template used by project', 'webpack')
  .action(() => {
    require(command_path('init'));
  });

program.parse(process.argv);    // 解析输入的参数，执行对应的命令操作
if(!program.args.length){
  //这里是处理默认没有输入参数或者命令的时候，显示help信息
  program.help();
}