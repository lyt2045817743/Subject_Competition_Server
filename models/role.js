const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    roleName:{
        type: String,
        required: true
    },
    // 业务权限
    busAuthVals: {
        type: Array,
        required: true
    },
    // 系统权限
    sysAuthVals: {
        type: Array,
        required: true
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

module.exports = Role = mongoose.model('role', roleSchema);