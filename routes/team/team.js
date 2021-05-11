const router = require('koa-router')();
const initCtx = require('../../util/initCtx');
const Team = require('../../models/team');
const Competition = require('../../models/competition');
const TeamUser = require('../../models/teamUser');
const User = require('../../models/user');
// const { chTeam } = require('../../util/checkParams');
const codeList = require('../../enum/codeList');

// 新增团队
router.post('/addTeam', async ctx => {

    const { teamName, managerId, membersId, teacherId, teamState, joinCondition, competitionId } = ctx.request.body;
    const team = new Team({
        teamName,
        managerId,
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
        const teamInfo = await team.save()

        // 团队添加成功后，向团队成员表中依次填入负责人和团队成员
        const teamUserList = [];
        const teamId = teamInfo._id;

        // 添加负责人
        teamUserList.push({
            teamId,
            numberId: managerId,
            isManager: true,
            competitionId
        })

        if(membersId && membersId.length) {
            membersId.forEach( item => {
                teamUserList.push({
                    teamId,
                    numberId: item,
                    isManager: false,
                    competitionId
                })
            })
        }

        // 将数据加入数据库中
        await TeamUser.insertMany(teamUserList).then( res => {
            
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
    const teamInfo = await Team.findOne({_id: teamId});
    let membersInfo = [];
    let teacherInfo = {};
    if(teamInfo) {
        
        teacherInfo = await User.findOne({numberId: teamInfo.teacherId})
        const memberInfo = await TeamUser.find({
            competitionId: teamInfo.competitionId,
            teamId: teamInfo._id,
            isManager: false
        })
        
        for(let i = 0; i < memberInfo.length; i++) {
            const userInfo = await User.find({numberId: memberInfo[i].numberId});
            membersInfo = membersInfo.concat(userInfo)
        }

    }
    
    new initCtx(ctx, 'SUCCESS', { ...teamInfo._doc, membersInfo, teacherInfo}).success()

})

// 用户获取某一赛事中我的团队
router.get('/getMyTeamInfo', async ctx => {
    const { teamId, numberId, competitionId } = ctx.query;
    const teamUserInfo = await TeamUser.findOne({teamId : {$regex: teamId ? teamId : ''}, numberId, competitionId});
    let myTeamInfo = {};
    if(teamUserInfo) {
        const teamId = teamUserInfo.teamId
        // console.log(teamId);
        myTeamInfo = await Team.findOne({_id: teamId});
    } 
    new initCtx(ctx, 'SUCCESS', myTeamInfo).success();
})

// 根据赛事名称获取团队列表
router.get('/getTeamListByCompName', async ctx => {
    const { pageNum, pageCount, keyword, compName } = ctx.query;

    const comp = await Competition.findOne({name : compName});
    let teamList = [];
    
    if(comp) {
        teamList = await Team.find({competitionId : {$in : comp['_id']}, "teamName" : {$regex: keyword ? keyword : ''}})
        .sort({'createTime': -1})
        .skip((pageCount-1)*pageNum)
        .limit(Number(pageNum));
    }

    new initCtx(ctx, 'SUCCESS', teamList).success()
})

// 根据teamName修改某个团队信息
router.put('/updateTeamInfo/:teamName', async ctx => {
    const teamName = ctx.params.teamName;
    const { teacherId, joinCondition, teamState, membersId, teamId, competitionId } = ctx.request.body;
    await Team.updateOne({teamName}, { teacherId, joinCondition, teamState })

    if(membersId && membersId.length) {

        for(let i = 0; i < membersId.length; i++) {
            const newMember = {
                teamId,
                numberId: membersId[i],
                isManager: false,
                competitionId
            };
            
            const result = await TeamUser.findOne(newMember)
            if(!result) {
                await (new TeamUser(newMember)).save()
            }
        }

    }

    new initCtx(ctx, '修改团队信息成功').success();

})

// 管理员根据teamName删除某团队
router.delete('/delTeam/:teamName', async (ctx) => {
    const teamName = ctx.params.teamName;
    
    await Team.deleteOne({teamName}).then( res => {
        new initCtx(ctx, '删除成功').success()
    }).catch( err => {

        console.log(err);
        new initCtx(ctx).fail('团队删除失败，请重试', 500);
    })

})

module.exports = router.routes();