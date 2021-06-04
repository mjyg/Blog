#!/usr/bin/env node
// 可执行文件前缀：标识Node环境执行

const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')

inquirer.prompt([
  {
    type:'confirm',
    message: '你想要花吗',
    name:'ok'
  },
  {
    type:'input',
    message: '你想要什么',
    name:'which'
  }
]).then(ans => {
  if(ans.ok) {
    console.log(chalk.green('有也不给'))
  } else {
    console.log(chalk.red('我没有'))
  }
  if(ans.which) {
    console.log(chalk.green(ans.which))
  }

  const spinner = ora('文件下载中').start()
  setTimeout(()=>{
    spinner.stop()
  }, 5000)
})