const inquirer = require('inquirer');   //命令行交互   https://github.com/SBoudrias/Inquirer.js
const program = require('commander');   //命令行工具   https://github.com/tj/commander.js
const chalk = require('chalk');         //命令行输出样式美化    https://github.com/chalk/chalk
const ora = require('ora');             //命令行加载中效果    https://github.com/sindresorhus/ora
const fs = require('fs');
const { resolve } = require('path');
const template_path = template => resolve(__dirname, '../templates/', template);
const cwd = process.cwd(); // 返回nodejs进程的当前工作目录

const ANSWER_DEFAULT = {name: 'myproject', description: '', author: ''};
let question = [
  {
    type: 'input',
    name: 'name',
    message: '项目名称',
    default: ANSWER_DEFAULT.name,
    filter: val => val.trim(),
    validate: val => {
      if(val.trim().split(" ").length > 1){
        return '项目名称不能包含空格';
      }else{
        try {
          fs.statSync(`${cwd}/${val}`);
          return `${val}项目已存在`;
        } catch (e) {}
      }
      return true;
    },
    transformer: val => val
  },
  {
    type: 'input',
    name: 'description',
    message: '项目描述',
    default: ANSWER_DEFAULT.description,
    transformer: val => val
  },
  {
    type: 'input',
    name: 'author',
    message: '项目所属人',
    default: ANSWER_DEFAULT.author,
    transformer: val => val
  }
];

const create = (src, dest) => {
  let files = fs.readdirSync(src); // 读取模板
  files.forEach((file) => {
    let srcPath = `${src}/${file}`, destPath = `${dest}/${file}`;
    let stats = fs.statSync(srcPath);

    // 是文件，拷贝文件（替换模板占位符）
    if (stats.isFile()) {
      let data = fs.readFileSync(srcPath, 'utf8');
      fs.writeFileSync(destPath, data, 'utf8');
      return;
    }

    // 是目录，递归拷贝
    if (stats.isDirectory()) {
      fs.mkdirSync(destPath);
      create(srcPath, destPath);
    }
  });
}

const update_pkgjson = ({name, description, author}) => {
  const data = fs.readFileSync(`./${name}/package.json`, 'utf8');
  const packageJson = JSON.parse(data);
  packageJson.name = name;
  packageJson.description = description;
  packageJson.author = author;
  var updatePackageJson = JSON.stringify(packageJson, null, 2);
  fs.writeFileSync(`./${name}/package.json`, updatePackageJson, 'utf8');
}

const update_project_config = ({name}) => {
  let data = fs.readFileSync(`./${name}/project.config.js`, 'utf8');
  console.log(data);
  data = data.replace(/\$NAME\$/g, name);
  console.log(data);
  fs.writeFileSync(`./${name}/project.config.js`, data, 'utf8');
}


const ARGS = program.args[0];
const isYes = ARGS.yes;      //处理传入-y参数时
isYes && (question = []);

module.exports = inquirer.prompt(question).then(data => {
  return isYes ? ANSWER_DEFAULT : data;
}).then((data) => {
  let { name, description, author } = data;
  const spinner = ora(`开始创建${name}项目`);
  spinner.start();
  const dest = `${cwd}/${name}`;
  fs.mkdirSync(dest);
  try {
    create(template_path(ARGS.template), dest);
    update_pkgjson(data);
    update_project_config(data);
    spinner.stop();
    console.log(chalk.green('项目创建成功！！！'));
    console.log(chalk.red('在project.config.js中配置项目特有属性'));
    console.log(`
      ${chalk.bgWhite.black('运行项目：')}
        ${chalk.yellow(`cd ${name}`)}
        ${chalk.yellow('npm install')}
        ${chalk.yellow('npm start')}
    `);
  } catch (error) {
    spinner.stop();
    console.error(error);
  }
  
  
});