const router = require('koa-router')();
const Competition = require('../../models/competition');
const InitRes = require('../../config/InitRes');
const { chCompetition } = require('../../config/checkParams');


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

    new chCompetition(ctx, name, institution, numLimit, curStageNum).chCompetitionFun();

    await competition.save()
    .then( res => {
        new InitRes(ctx, '添加赛事成功').success();
    })
    .catch( err => {
        console.log(err);
        new InitRes(ctx).fail('添加赛事失败', 500);
    })

})


router.get('/queryCompList', async ctx => {
    
    const { pageNum, pageCount, keyword } = ctx.query;

    const listdata = await Competition.find({},{'name':1,'_id':1, 'createTime': 1, 'institution': 1, 'currentInsti': 1, 'createTime': 1, 'curStageNum': 1, 'deadlineDate': 1}).sort({'createTime': -1}).skip((pageCount-1)*pageNum).limit(Number(pageNum));
    
    new InitRes(ctx, 'SUCCESS', listdata).success();
})

module.exports = router.routes();