const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const institutionSchema = new Schema({
    // 单位名称
    name: {
        type: String,
        require: true,
        unique: true
    },
    // 负责人
    manager: {
        type: String,
    },
    // 负责人联系方式
    managerTel: {
        type: String
    },
    // 层级：属于第几层级
    level: {
        type: Number,
        require: true
    },
    // 父层级的_id：如果没有父层级，则返回null
    parentId: {
        type: String
    }
},
{
    versionKey: false
})

module.exports = Institution = new mongoose.model('institution', institutionSchema)