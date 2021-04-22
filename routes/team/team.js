const router = require('koa-router')();
const initCtx = require('../../util/initCtx');
const Team = require('../../models/team');
// const { chTeam } = require('../../util/checkParams');
const codeList = require('../../enum/codeList');

// 管理员新增团队
router.post('/addTeam', async ctx => {

    const { teamName, managerId, membersId, teacherId, teamState, joinCondition, competitionId } = ctx.request.body;
    const team = new Team({
        teamName,
        managerId,
        membersId,
        teacherId,
        teamState,
        joinCondition,
        competitionId
    })

    // const check = new chTeam(ctx, teamName);
    // check.chTeamFun();
    const data = await Team.find({'teamName': teamName})
    if(data.length) {
        new initCtx(ctx).fail('团队名称已经存在', 200, codeList.repeat);
    } else {
        await team.save()
        .then( res => {
            new initCtx(ctx, '添加团队成功').success();
        })
        .catch( err => {
            console.log(err);
            new initCtx(ctx).fail('添加团队失败', 500);
        })
    }
    
})

// 获取团队列表
router.get('/queryTeamList', async ctx => {
    const { pageNum, pageCount, keyword, competitionId } = ctx.query;

    let listdata = [];

    if(pageNum == -1 && pageCount == -1) {
        listdata = await Team.find({"teamName" : {$regex: keyword ? keyword : ''}, "competitionId" : competitionId})
        .sort({'createTime': -1})

    } else {
        listdata = await Team.find({"teamName" : {$regex: keyword ? keyword : ''}, "competitionId" : competitionId})
        .sort({'createTime': -1})
        .skip((pageCount-1)*pageNum)
        .limit(Number(pageNum));
    }
    new initCtx(ctx, 'SUCCESS', listdata).success();
    
})

// 根据teamId获取单个团队信息
router.get('/getTeamInfo/:teamId', async ctx => {
    const teamId = ctx.params.teamId;
    await Team.findOne({_id: teamId}).then( res => {
        new initCtx(ctx, 'SUCCESS', res).success()
    }).catch( err => {
        console.log(err);
        new initCtx(ctx).fail('团队查询失败，请稍后重试', 500)
    })
})

// // 根据teamName修改某个团队信息
// router.put('/updateTeamInfo/:teamName', async ctx => {
//     const teamName = ctx.params.teamName;
//     const { busAuthVals, sysAuthVals } = ctx.request.body;
//     await Team.updateOne({teamName}, { busAuthVals, sysAuthVals }).then( res => {
//         new initCtx(ctx, '修改成功').success();
//     }).catch( err => {
//         console.log(err);
//         new initCtx(ctx).fail('修改失败，请稍后重试', 500)
//     })
// })

// // 根据teamName删除某团队
// router.delete('/delTeam/:teamName', async (ctx) => {
//     const teamName = ctx.params.teamName;
    
//     await Team.deleteOne({teamName}).then( res => {
//         new initCtx(ctx, '删除成功').success()
//     }).catch( err => {

//         console.log(err);
//         new initCtx(ctx).fail('团队删除失败，请重试', 500);
//     })

// })

module.exports = router.routes();