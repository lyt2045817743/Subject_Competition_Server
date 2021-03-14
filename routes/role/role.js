const router = require('koa-router')();
const initCtx = require('../../util/initCtx');
const Role = require('../../models/role');
const { chRole } = require('../../util/checkParams');
const codeList = require('../../enum/codeList');

// 管理员新增用户
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

// 管理员获取用户列表
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

module.exports = router.routes();