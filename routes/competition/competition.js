const router = require('koa-router')();
const Competition = require('../../models/competition');
const InitRes = require('../../config/InitRes');
const { chCompetition } = require('../../config/checkParams');


router.post('/addCompetition', async ctx => {

    const { name, institution, numLimit, curStageNum, deadlineDate } = ctx.request.body;
    const competition = new Competition({
        name,
        institution,
        numLimit,
        curStageNum,
        deadlineDate
    })

    new chCompetition(ctx, name, institution, numLimit, curStageNum).chCompetitionFun();

    await competition.save()
    .then( res => {
        console.log('添加赛事成功');
        new InitRes(ctx, '添加赛事成功').success();
    })
    .catch( err => {
        console.log(err);
        new InitRes(ctx).fail('添加赛事失败', 500);
    })

})

module.exports = router.routes();