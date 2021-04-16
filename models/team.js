const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    teamName:{
        type: String,
        unique:true,
        require: true
    },
    managerId:{
        type: String,
        require: true
    },
    membersId: {
        type: Array,
    },
    teacherId: {
        type: String
    },
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