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
        type: String
    },
    curStageNum: {
        type: Number,
        required: true
    },
},
    {
        versionKey: false
    }
)

module.exports = Competition = mongoose.model('competition', competitionSchema);