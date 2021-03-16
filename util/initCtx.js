// 用来初始化返回的响应
class initCtx{
    constructor(ctx, msg='SUCCESS', data=[], code=200, token='') {
        this.ctx = ctx;
        this.msg = msg;
        this.data = data;
        this.code = code;
        this.token = token;
    }

    success() {
        this.ctx.body = {
            ...this.ctx.body,
            data: this.data,
            msg: this.msg,
            code: 2000
        }

        if(this.token) {
            this.ctx.body.token = this.token;
        }

        this.ctx.status = this.code;
    }

    fail(failMsg, failCode, code) {
        this.ctx.body = {
            msg: failMsg,
            code,
        }
        this.ctx.status = failCode;
    }
}

module.exports = initCtx;