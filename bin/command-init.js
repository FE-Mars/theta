const program = require('commander');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const inquirer = require('inquirer');
const Utils = require('../common/utils.js');


program.usage('<project-name>')
  .option('-y, --yes', 'Use default values All')
  .option('-t, --template [templateName]', 'Template used by project', 'webpack')
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
    console.log(answers);
    Utils.downloadGitRepo(
      program.repository ? program.repository : `http://git.firstshare.cn/fe-tools/theta-template#${program.template}`,
      answers.build_in_current ? '.' : answers.name
    );
  });
})

 
