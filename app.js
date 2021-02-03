const koa = require('koa');
const router = require('koa-router')()

const app = new koa();

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
console.log('学科竞赛系统后台启动成功');


