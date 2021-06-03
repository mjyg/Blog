module.exports = function mainDoit(){
  const program = require('commander')

  program.version(require('../package').version)
  program
    .command('init <number> [number]', '初始化')  //跑bin下的doit-list.js(主命令拼接子命令)
    .command('list', '所有列表').action(()=>{
      console.log('123')
  })

  program.parse(process.argv)
}