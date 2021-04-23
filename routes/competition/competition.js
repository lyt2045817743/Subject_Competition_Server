const router = require('koa-router')();
const Competition = require('../../models/competition');
const initCtx = require('../../util/initCtx');
const { chCompetition } = require('../../util/checkParams');
const codeList = require('../../enum/codeList');

router.post('/addCompetition', async ctx => {

    const { name, institution, numLimit, curStageNum, deadlineDate,currentInsti,createTime,createUser } = ctx.request.body;
    const competition = new Competition({
        name,
        institution,
        numLimit,
        curStageNum,
        deadlineDate,
        currentInsti,
        createTime,
        createUser
    })

    const check = new chCompetition(ctx, name, institution, numLimit, curStageNum);
    check.chCompetitionFun();
    // check.chUnique(name, Competition)
    const data = await Competition.find({'name': name})
    if(data.length) {
        new initCtx(ctx).fail('赛事名称重复', 200, codeList.repeat);
    } else {
        await competition.save()
        .then( res => {
            new initCtx(ctx, '添加赛事成功').success();
        })
        .catch( err => {
            console.log(err);
            new initCtx(ctx).fail('添加赛事失败', 500);
        })
    }

})


router.get('/queryCompList', async ctx => {
    
    const { pageNum, pageCount, keyword } = ctx.query;

    const listdata = await Competition.find({"name" : {$regex: keyword ? keyword : ''}},{'name':1,'_id':1, 'createTime': 1, 'institution': 1, 'currentInsti': 1, 'createTime': 1, 'createUser': 1, 'curStageNum': 1, 'deadlineDate': 1}).sort({'createTime': -1}).skip((pageCount-1)*pageNum).limit(Number(pageNum));
    
    new initCtx(ctx, 'SUCCESS', listdata).success();
})

// 根据name删除某赛事
router.delete('/delComp/:name', async (ctx) => {
    const name = ctx.params.name;
    
    await Competition.deleteOne({name}).then( res => {
        new initCtx(ctx, '删除成功').success()
    }).catch( err => {

        console.log(err);
        new initCtx(ctx).fail('赛事删除失败，请重试', 500);
    })

})

module.exports = router.routes();