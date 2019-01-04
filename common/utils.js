const path = require('path');
const downloadGitRepo = require('download-git-repo');
const ora = require('ora')

module.exports = {
  downloadGitRepo(url, destination) {
    return new Promise((resolve, reject) => {
      const spinner = ora(`Downloading template, source address: ${url}`);
      spinner.start();
      downloadGitRepo(`direct:${url}`, destination, {clone: true}, (err) => {
        if(err){
          spinner.fail();
          reject(err);
        }else{
          spinner.succeed();
          resolve(destination);
        }
      });
    });
  }
}