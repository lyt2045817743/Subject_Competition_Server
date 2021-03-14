const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const Userchema = new Schema({
    userName:{
        type: String
    },
    numberId:{
        type: String,
        unique:true,
        require: true
    },
    password: {
        type: String
    },
    initPwd: {
        type: String,
        require: true
    },
    identityType: { // 0 教师、1 专家、 2 学生
        type: Number,
        require: true
    },
    institution: {
        type: String,
    },
    isManager: {
        type: Boolean,
        default: false
    },
    roleVal: {
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

module.exports = User = mongoose.model('user', Userchema);