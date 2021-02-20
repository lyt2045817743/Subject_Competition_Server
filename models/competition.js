const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const competitionSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    numLimit: {
        type: Number,
        required: true
    },
    institution: {
        type: String,
        required: true
    },
    deadlineDate: {
        type: Date
    },
    curStageNum: {
        type: Number,
        required: true
    },
    currentInsti: {
        type: String
    },
    createTime: {
        type: Date
    },
    createUser: {
        type: String
    }
},
    {
        versionKey: false
    }
)

module.exports = Competition = mongoose.model('competition', competitionSchema);