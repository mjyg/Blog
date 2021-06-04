module.exports = function mainDoit(){
  const program = require('commander')

  program.version(require('../package').version)
  program
    .command('init <number> [number]', '初始化')
    .command('list', '所有列表').action(()=>{  //跑bin下的doit-list.js(主命令拼接子命令)
      console.log('123')
  })

  program.parse(process.argv)
}