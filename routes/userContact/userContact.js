const router = require('koa-router')();
const UserContact = require('../../models/userContact');
const initCtx = require('../../util/initCtx');
const User = require('../../models/user')

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

router.get('/getFollow', async ctx => {
    const { pageNum, pageCount, keyword, numberId } = ctx.query;

    let listdata = [];

    if(pageNum == -1 && pageCount == -1) {
        listdata = await UserContact.find({"fromUser": numberId})
        .sort({'createTime': -1})

    } else {
        listdata = await UserContact.find({"fromUser": numberId})
        .sort({'createTime': -1})
        .skip((pageCount-1)*pageNum)
        .limit(Number(pageNum));
    }

    let userList = []

    for(let i = 0; i < listdata.length; i++) {
        const result = await User.findOne({ numberId: listdata[i].toUser });
        userList.push(result)
    }

    new initCtx(ctx, 'SUCCESS', userList).success();
})

module.exports = router.routes()