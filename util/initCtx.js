// 用来初始化返回的响应
class initCtx{
    constructor(ctx, msg='SUCCESS', data=[], code=200) {
        this.ctx = ctx;
        this.msg = msg;
        this.data = data;
        this.code = code;
    }

    success() {
        this.ctx.body = {
            data: this.data,
            msg: this.msg
        }
        this.ctx.status = this.code;
    }

    fail(failMsg, failCode) {
        this.ctx.body = {
            msg: failMsg,
        }
        this.ctx.status = failCode;
    }
}

module.exports = initCtx;