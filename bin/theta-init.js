const program = require('commander');     //命令行工具   https://github.com/tj/commander.js
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');     //命令行交互   https://github.com/SBoudrias/Inquirer.js
const chalk = require('chalk');           //命令行输出样式美化    https://github.com/chalk/chalk
const logSymbols = require('log-symbols');      //增加log级别的图标  https://github.com/sindresorhus/log-symbols
const Utils = require('../common/utils.js');


program.usage('<project-name>')
  .option('-y, --yes', 'Use default values All')
  .option('-t, --template [templateName]', 'Template used by project', 'webpack-seajs')
  .option('-r, --repository [repository]', 'Using the specified repository')
  .parse(process.argv);

function createPrompts(object) {
  return program.yes ? [] : [
    {
      name: 'name',
      message: 'name',
      default: object.name,
      validate(value) {
        try {
          fs.statSync(`${process.cwd()}/${value}`);
          return `${value} directory is exist`;
        } catch (error) {  
        }
        return true;
      }
    },
    {
      type: 'confirm',
      name: 'build_in_current',
      message: 'The current directory name is the same as the project name. Do you want to create a new project directly in the current directory?',
      default: true,
      when(answers) {
        if(answers.name === path.basename(process.cwd()))     //判断是否跟当前目录名称相同
          return true;
        return false;
      }
    },
    {
      name: 'version',
      message: 'version',
      default: object.version
    },
    {
      name: 'description',
      message: 'description',
      default: object.description
    }
  ];
}

new Promise(resolve => {
  let result = {
    name: 'new_project',
    version: '1.0.0',
    description: 'A project create by theta.'
  };
  if(!program.yes){
    result.name = program.args[0] || result.name;
  }
  resolve(result);
}).then((result) => {
  inquirer.prompt(createPrompts(result)).then(answers => {
    if(Object.keys(answers).length === 0) answers = result;     //如果没有答案使用默认值
    Utils.downloadGitRepo(
      program.repository ? program.repository : `https://github.com/FE-Mars/theta-template#${program.template}`,
      answers.build_in_current ? '.' : answers.name
    ).then((destination) => {
      Utils.updatedFile(path.join(destination, 'package.json'), answers);     //修改package.json文件的相关信息
      if(!program.repository && program.template === 'webpack-seajs')     //只有当采用默认的模板时
        Utils.updatedFile(path.join(destination, 'project.config.js'), answers);    //修改project.config.js文件的相关信息

      console.log();
      console.log(logSymbols.success, chalk.green('SUCCESS'));
      console.log();
      console.log(chalk.bgWhite.black('You need：'));
      !answers.build_in_current && console.log(chalk.yellow(`\tcd ${answers.name}`));
      console.log(`\t${chalk.yellow('npm install')}\n\t${chalk.yellow('npm start')}`);
      console.log();
    }, (error) => {
      console.log(logSymbols.error, chalk.red(`FAILD: ${error}`));
    });
  });
})

 
