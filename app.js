const Koa = require('koa');
const router = require('koa-router')()
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');

const competition = require('./routes/competition/competition');
const { dbUrl } = require('./config/base');
const MidWareOfErr = require('./config/MidWareOfError');

const app = new Koa();
app.use(bodyParser());
app.use(MidWareOfErr)

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then((res) => {
    console.log('数据库链接成功');
})
.catch((err) => {
    console.log('数据库链接失败');
})


// app.use(banner).use(router.allowedMethods());
router.use('/api/competition', competition)
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000)
console.log('学科竞赛系统后台启动成功');