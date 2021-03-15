const router = require('koa-router')();
const initCtx = require('../../util/initCtx');
const User = require('../../models/user')
const codeList = require('../../enum/codeList');
const { chUser } = require('../../util/checkParams')
// const async = require('async');

// 管理员新增用户
router.post('/addUser', async ctx => {
    const { identityType, numberIds, isManager, initPwd, roleVal } = ctx.request.body;

    // 失败代码开始 -- 如果列表中的用户有些已经存在，则返回提示

    // const dataList = [];
    // const repeatArr = [];
    // const callbacks = [];

    // JSON.parse(numberIds).map( numberId => {
    //     const fun = function(callback) {
    //         User.find({'numberId': numberId}).then( data => {
                
    //             if(data.length) {
    //                 repeatArr.push(numberId)
    //                 // console.log('repeat');
    //             } else {
    //                 dataList.push({identityType, numberId, isManager, initPwd, roleVal});
    //                 // console.log('norepeat', dataList);
    //             }
    //             callback(null, numberId)
    //         })
    //     }
    //     callbacks.push(fun) 
    // })

    // async.series(callbacks,function(err, numberId){ 
        
    //     if(repeatArr.length) {
    //         console.log('重复！！');
    //         new initCtx(ctx).fail('用户重复' + JSON.stringify(repeatArr), 200, codeList.repeat);
    //     } else {
    //         insert()
    //     }
  
    // }) 

    // 失败代码结束

    // 方法一代码开始 -- 并不知道哪个是成功添加，哪个是已存在未成功的
    // const dataList = [];
    // JSON.parse(numberIds).forEach( numberId => {
    //     dataList.push({identityType, numberId, isManager, initPwd, roleVal})
    // })



    // await User.insertMany(dataList).then( res => {
    //     new initCtx(ctx, '添加用户成功').success();
    // }).catch( err => {

    //     console.log(err);
    //     if(err.code === 11000) {
    //         new initCtx(ctx).fail('某用户已存在，其余用户已成功添加', 200, codeList.repeat);
    //     } else {
    //         new initCtx(ctx).fail('添加用户失败', 500);
    //     }
    // })

    // 方法一代码结束


    // 方法二代码失败 开始

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
    // 方法二代码结束
        
})


// 用户登录
router.post('/login', async ctx => {
    const { numberId, password } = ctx.request.body;
    const user = await User.find({"numberId": numberId, "password": password});
    if(user.length) {
        new initCtx(ctx, '登录成功').success()
    } else {
        new initCtx(ctx).fail('登录失败', 200, codeList.notFound);
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

// 根据numberId获取单个用户信息
router.get('/getUserInfo/:numberId', async ctx => {
    const numberId = ctx.params.numberId;
    await User.findOne({numberId}, {
        'identityType': 1,
        // 'initPwd': 1,
        'isManager': 1,
        'numberId': 1,
        'roleVal': 1,
        '_id': 1
    }).then( res => {
        new initCtx(ctx, 'SUCCESS', res).success()
    }).catch( err => {
        console.log(err);
        new initCtx(ctx).fail('用户查询失败，请稍后重试', 500)
    })
})

// 根据numberId修改某个用户信息
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

// 根据numberId删除某用户
router.delete('/delUser/:numberId', async (ctx) => {
    const numberId = ctx.params.numberId;
    
    await User.deleteOne({numberId}).then( res => {
        new initCtx(ctx, '删除成功').success()
    }).catch( err => {

        console.log(err);
        new initCtx(ctx).fail('用户删除失败，请稍后重试', 500);
    })

})

module.exports = router.routes();