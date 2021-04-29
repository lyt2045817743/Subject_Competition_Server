const router = require('koa-router')();
const User = require('../../models/user')
const codeList = require('../../enum/codeList');

const initCtx = require('../../util/initCtx');
const { chUser } = require('../../util/checkParams')
const { genToken } = require('../../util/tokenManager')
// const async = require('async');




/********************************************* 管理员操作接口 *********************************************/



// 管理员新增用户
router.post('/addUser', async ctx => {
    const { identityType, numberIds, isManager, initPwd, roleVal } = ctx.request.body;

    for(let i=0; i<numberIds.length; i++) {
        const numberId = numberIds[i];

        const user = new User({
            identityType, numberId, isManager, initPwd, roleVal, password: initPwd
        })

        const check = new chUser(identityType, numberId, initPwd);
        check.chUserFun();

        await user.save().then(res => {
            new initCtx(ctx, '添加用户成功').success();
        }).catch( err => {

            if(err.code === 11000) {
                new initCtx(ctx).fail('添加失败：'+numberId + '用户已存在，请去除它后重试', 200, codeList.repeat);
            } else {
                new initCtx(ctx).fail('用户添加失败，请重试', 500);
            }
        })

    }
        
})

// 管理员获取用户列表
router.get('/queryUserList', async ctx => {
    const { pageNum, pageCount, keyword } = ctx.query;

    const listdata = await User.find({"numberId" : {$regex: keyword ? keyword : ''}},{
        'identityType': 1,
        // 'initPwd': 1,
        'isManager': 1,
        'numberId': 1,
        'roleVal': 1,
        '_id': 1
    })
        // .sort({'createTime': -1})
        .skip((pageCount-1)*pageNum)
        .limit(Number(pageNum));

    // ... 查询时的数据中说明是否为最后一页
    
    new initCtx(ctx, 'SUCCESS', listdata).success();
})

// 管理员根据numberId获取单个用户信息
router.get('/getUserInfo/:numberId', async ctx => {
    const numberId = ctx.params.numberId;
    await User.findOne({numberId}, {
        "isManager": 1,
        "_id": 1,
        "identityType": 1,
        "numberId": 1,
        "roleVal": 1,
        "userName": 1,
        "contactWay":1,
        "avatarUrl":1,
        "institution":1,
    }).then( res => {
        new initCtx(ctx, 'SUCCESS', res).success()
    }).catch( err => {
        console.log(err);
        new initCtx(ctx).fail('用户查询失败，请稍后重试', 500)
    })
})

// 管理员根据numberId修改某个用户信息
router.put('/updateUserInfo/:numberId', async ctx => {
    const numberId = ctx.params.numberId;
    const { isManager, roleVal } = ctx.request.body;
    await User.updateOne({numberId}, {isManager, roleVal}).then( res => {
        new initCtx(ctx, '修改成功').success();
    }).catch( err => {
        console.log(err);
        new initCtx(ctx).fail('修改失败，请稍后重试', 500)
    })
})

// 管理员根据numberId删除某用户
router.delete('/delUser/:numberId', async (ctx) => {
    const numberId = ctx.params.numberId;
    
    await User.deleteOne({numberId}).then( res => {
        new initCtx(ctx, '删除成功').success()
    }).catch( err => {

        console.log(err);
        new initCtx(ctx).fail('用户删除失败，请稍后重试', 500);
    })

})






/*********************************************** 用户操作接口 **************************************************/





// 用户登录
router.post('/login', async ctx => {
    const { numberId, password } = ctx.request.body;
    
    await User.findOne({"numberId": numberId, "password": password}).then( user => {
        // console.log(user);
        const { numberId, isManager, identityType, userName, institution } = user;
        const token = genToken({numberId, isManager, identityType, userName, institution}, 'userAuth');
        new initCtx(ctx, '登录成功', { token, numberId, isManager, identityType, userName, institution }).success()
    }).catch( err => {
        console.log(err);
        new initCtx(ctx).fail('登录失败', 200, codeList.notFound);
    })

})



// 用户自己修改个人信息
router.put('/modifyPrivateInfo', async ctx => {
    // console.log(ctx.state.user);
    const { numberId } = ctx.state.user;
    const body = ctx.request.body;
    
    await User.updateOne({numberId}, { ...body }).then( res => {
        new initCtx(ctx, '修改成功').success();
    }).catch(err => {
        console.log(err);
        new initCtx(ctx).fail('修改失败，请稍后重试', 500)
    })
    
})

// 获取单个用户全部信息
router.get('/getPrivateInfo', async ctx => {
    const { numberId } = ctx.state.user;
    await User.findOne({numberId}, {
        "isManager": 1,
        "_id": 1,
        "identityType": 1,
        "numberId": 1,
        "roleVal": 1,
        "userName": 1,
        "contactWay":1,
        "avatarUrl":1,
        "institution":1,
    }).then( res => {
        new initCtx(ctx, 'SUCCESS', res).success()
    }).catch( err => {
        console.log(err);
        new initCtx(ctx).fail('用户查询失败，请稍后重试', 500)
    })
})




module.exports = router.routes();