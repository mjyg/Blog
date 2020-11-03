//接口测试
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
    ctx.body = {
        data:'jie'
    };
});

app.listen(3000,() => {
    console.log('服务启动成功')
});

module.exports = app