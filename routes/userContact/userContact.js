const router = require('koa-router')();
const UserContact = require('../../models/userContact');
const initCtx = require('../../util/initCtx');

router.post('/followSomeone', async ctx => {
    const { fromUser, toUser, status } = ctx.request.body;
    const result = await UserContact.updateOne({fromUser: toUser, toUser: fromUser, status: 1}, {status: 2})
    
    let contact = {};
    if(result && result.nModified) {
        contact = new UserContact({
            fromUser,
            toUser,
            status: 2
        })
    } else {
        contact = new UserContact({
            fromUser,
            toUser,
            status
        })
    }
    

    await contact.save();
    new initCtx(ctx, '关注成功', []).success()
})

module.exports = router.routes()