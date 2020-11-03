const Mocha = require('mocha')

const mocha = new Mocha({
    reporter:'mochawesome', //配置报表
    reporterOptions:{
        reportDir:'docs/mochawesome-report'
    }
})

mocha.addFile('./tests/service/app.spec.js')  //添加测试文件
mocha.run(function(){
    process.exit(0) //退出进程
})