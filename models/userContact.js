const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserContactSchema = new Schema({
    fromUser:{
        type: String,
        require: true
    },
    toUser: {
        type: String,
        require: true
    },
    // 1 单向关注， 2 双向关注， 0 拉黑（待定） 
    status:{
        type: Number,
        require: true
    },
},
    {
        versionKey: false
    }
)

module.exports = UserContact = mongoose.model('userContact', UserContactSchema);