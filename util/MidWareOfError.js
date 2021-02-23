// 全局捕捉异常，然后输出异常类别与信息
const CatchError = require('./catchError');

const MidWareOfErr = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        const isKnown = error instanceof CatchError;
        if(isKnown) {
            console.log('已知异常：' + error.msg);
            ctx.body = {
                msg: error.msg
            }
            ctx.status = error.code
        } else {
            console.log('未知异常：', error);
            
            ctx.body = {
                msg: '服务器发生错误'
            }
            ctx.status = 500
        }
    }
}

module.exports = MidWareOfErr;