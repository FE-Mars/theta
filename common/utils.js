const path = require('path');
const fs = require('fs');
const downloadGitRepo = require('download-git-repo');
const ora = require('ora');        //命令行加载中效果    https://github.com/sindresorhus/ora
const Handlebars = require('handlebars')

module.exports = {
  downloadGitRepo(url, destination) {
    destination = path.join('.', destination);
    return new Promise((resolve, reject) => {
      const spinner = ora(`Downloading template, source address: ${url}`);
      spinner.start();
      downloadGitRepo(`direct:${url}`, destination, {clone: true}, (error) => {
        if(error){
          spinner.fail();
          reject(error);
        }else{
          spinner.succeed();
          resolve(destination);
        }
      });
    });
  },

  updatedFile(url, data) {
    const file_content = fs.readFileSync(url).toString();
    fs.writeFileSync(url, Handlebars.compile(file_content)(data));
  }
}