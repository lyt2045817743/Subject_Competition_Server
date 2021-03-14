const Koa = require('koa');
const router = require('koa-router')()
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');

const competition = require('./routes/competition/competition');
const role = require('./routes/role/role');
const user = require('./routes/user/user');

const { dbUrl } = require('./util/base');
const MidWareOfErr = require('./util/MidWareOfError');

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

app.use(cors());
// app.use(banner).use(router.allowedMethods());
router.use('/api/competition', competition);
router.use('/api/role', role);
router.use('/api/user', user);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(5000)
console.log('学科竞赛系统后台启动成功');