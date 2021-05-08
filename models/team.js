const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    teamName:{
        type: String,
        unique:true,
        require: true
    },
    competitionId:{
        type: String,
        require: true
    },
    managerId:{
        type: String,
        require: true
    },
    teacherId: {
        type: String
    },
    // 0 招募中； 1 已招满
    teamState: {
        type: Number
    },
    joinCondition: {
        type: String
    },
    hasCommit: {
        type: Boolean,
        default: false
    }
},
    {
        versionKey: false
    }
)

module.exports = Team = mongoose.model('team', TeamSchema);