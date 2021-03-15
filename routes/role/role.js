const router = require('koa-router')();
const initCtx = require('../../util/initCtx');
const Role = require('../../models/role');
const { chRole } = require('../../util/checkParams');
const codeList = require('../../enum/codeList');

// 管理员新增角色
router.post('/addRole', async ctx => {

    const { roleName, busAuthVals, sysAuthVals } = ctx.request.body;
    const role = new Role({
        roleName, busAuthVals, sysAuthVals
    })

    const check = new chRole(ctx, roleName);
    check.chRoleFun();
    const data = await Role.find({'roleName': roleName})
    if(data.length) {
        new initCtx(ctx).fail('角色名称已经存在', 200, codeList.repeat);
    } else {
        await role.save()
        .then( res => {
            new initCtx(ctx, '添加角色成功').success();
        })
        .catch( err => {
            console.log(err);
            new initCtx(ctx).fail('添加角色失败', 500);
        })
    }
    
})

// 管理员获取角色列表
router.get('/queryRoleList', async ctx => {
    const { pageNum, pageCount, keyword } = ctx.query;

    let listdata = [];

    if(pageNum == -1 && pageCount == -1) {
        listdata = await Role.find({"roleName" : {$regex: keyword ? keyword : ''}})
        .sort({'createTime': -1})

    } else {
        listdata = await Role.find({"roleName" : {$regex: keyword ? keyword : ''}})
        .sort({'createTime': -1})
        .skip((pageCount-1)*pageNum)
        .limit(Number(pageNum));
    }
    new initCtx(ctx, 'SUCCESS', listdata).success();
    
})

// 根据roleName获取单个角色信息
router.get('/getRoleInfo/:roleName', async ctx => {
    const roleName = ctx.params.roleName;
    await Role.findOne({roleName}).then( res => {
        new initCtx(ctx, 'SUCCESS', res).success()
    }).catch( err => {
        console.log(err);
        new initCtx(ctx).fail('角色查询失败，请稍后重试', 500)
    })
})

// 根据roleName修改某个角色信息
router.put('/updateRoleInfo/:roleName', async ctx => {
    const roleName = ctx.params.roleName;
    const { busAuthVals, sysAuthVals } = ctx.request.body;
    await Role.updateOne({roleName}, { busAuthVals, sysAuthVals }).then( res => {
        new initCtx(ctx, '修改成功').success();
    }).catch( err => {
        console.log(err);
        new initCtx(ctx).fail('修改失败，请稍后重试', 500)
    })
})

// 根据roleName删除某角色
router.delete('/delRole/:roleName', async (ctx) => {
    const roleName = ctx.params.roleName;
    
    await Role.deleteOne({roleName}).then( res => {
        new initCtx(ctx, '删除成功').success()
    }).catch( err => {

        console.log(err);
        new initCtx(ctx).fail('角色删除失败，请重试', 500);
    })

})

module.exports = router.routes();