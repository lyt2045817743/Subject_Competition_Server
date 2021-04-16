const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
        type: Array,
    },
    isManager: {
        type: Boolean,
        default: false
    },
    roleVal: {
        type: String
    },
    // 头像URL
    avatorUrl: {
        type: String
    },
    // 联系方式
    contactWay: {
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

module.exports = User = mongoose.model('user', UserSchema);