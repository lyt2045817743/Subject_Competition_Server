const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamUserSchema = new Schema({
    teamId:{
        type: String,
        require: true
    },
    competitionId: {
        type: String,
        require: true
    },
    numberId:{
        type: String,
        require: true
    },
    isManager: {
        type: Boolean,
        default: false
    }
},
    {
        versionKey: false
    }
)

module.exports = TeamUser = mongoose.model('teamUser', TeamUserSchema);