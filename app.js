// 引入第三方模块
const Koa = require('koa');
const router = require('koa-router')()
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const koajwt = require('koa-jwt');

// 引入子路由
const competition = require('./routes/competition/competition');
const role = require('./routes/role/role');
const user = require('./routes/user/user');
const institution = require('./routes/institution/institution');

// 引入工具类
const { dbUrl } = require('./util/base');
const MidWareOfErr = require('./util/MidWareOfError');
const { genToken, decodeToken } = require('./util/tokenManager');

const app = new Koa(); 


app.use(async(ctx, next)=> {
    var token = ctx.headers.authorization;
    if(token){

        token = token.substr(7);
        const user = decodeToken(token);
        
        if(user) {
            
            const { numberId, isManager, identityType } = user;
            const newToken = genToken({numberId, isManager, identityType}, 'userAuth')
            ctx.headers.authorization = 'Bearer '+ newToken;  

        }

    }
    await next();
})

app.use(async(ctx, next)=>{
    return next().catch((err) => {
        if (401 == err.status) {
          ctx.status = 401;
            ctx.body = {
                status:401,
                msg:'登录过期，请重新登录'
            }
        } else {
            throw err;
        }
    });
});

app.use(koajwt({
    secret: 'userAuth'
}).unless({
    path: [/\/api\/user\/login/]
}));

app.use(bodyParser());
app.use(MidWareOfErr)

// 链接数据库
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

// 处理跨域
app.use(cors());
// app.use(banner).use(router.allowedMethods());

// 路由配置
router.use('/api/competition', competition);
router.use('/api/role', role);
router.use('/api/user', user);
router.use('/api/institution', institution);


app.use(router.routes());
app.use(router.allowedMethods());

app.listen(5000)
console.log('学科竞赛系统后台启动成功');