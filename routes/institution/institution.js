const router = require('koa-router')();
const Insitution = require('../../models/institution');
const User = require('../../models/user')

const initCtx = require('../../util/initCtx');
const codeList = require('../../enum/codeList');

router.post('/addInsitution', async ctx => {
    const { name, manager, managerTel, level, parentId } = ctx.request.body;
    const institution = new Insitution({
        name,
        manager,
        managerTel,
        level,
        parentId
    })
    
    const data = await User.findOne({ numberId: manager });
    if(!data) {
        new initCtx(ctx).fail('添加失败，请确认管理者学工号后重试！', 500);
    } else {
        await institution.save().then( res => {
            new initCtx(ctx, '添加成功！').success();
        }).catch( err => {
            if(err.code === 11000) {
                new initCtx(ctx).fail('添加失败：' + name + '已存在！', 200, codeList.repeat);
            } else {
                console.log(err);
                new initCtx(ctx).fail('添加失败，请稍后重试！', 500);
            }
        })
    }
});

router.get('/queryInstiList', async ctx => {
    const { pageNum, pageCount, keyword, parentId } = ctx.query;

    const listdata = await Insitution.find({"name" : {$regex: keyword ? keyword : ''}, "parentId" : parentId},{
        'name': 1,
        'manager': 1,
        'managerTel': 1,
        '_id': 1,
        'parentId': 1
    })
        // .sort({'createTime': -1})
        .skip((pageCount-1)*pageNum)
        .limit(Number(pageNum));

    // ... 查询时的数据中说明是否为最后一页
    
    new initCtx(ctx, 'SUCCESS', listdata).success();
});

router.get('/getInstiInfo/:name', async ctx => {
    const name = ctx.params.name;
    await Insitution.findOne({name}, {
        'name': 1,
        'manager': 1,
        'managerTel': 1,
        '_id': 1
    }).then( res => {
        new initCtx(ctx, 'SUCCESS', res).success()
    }).catch( err => {
        console.log(err);
        new initCtx(ctx).fail('用户查询失败，请稍后重试', 500)
    })
})

router.put('/updateInstiInfo/:name', async ctx => {
    const name = ctx.params.name;
    const { manager, managerTel } = ctx.request.body;
    await Insitution.updateOne({name}, {manager, managerTel}).then( res => {
        new initCtx(ctx, '修改成功').success();
    }).catch( err => {
        console.log(err);
        new initCtx(ctx).fail('修改失败，请稍后重试', 500)
    })
})

router.delete('/delInsti/:name', async (ctx) => {
    const name = ctx.params.name;
    // ... 如果当前单位有子单位，则不可删除
    
    await Insitution.deleteOne({name}).then( res => {
        new initCtx(ctx, '删除成功').success()
    }).catch( err => {

        console.log(err);
        new initCtx(ctx).fail('删除失败，请稍后重试', 500);
    })

})

module.exports = router.routes()