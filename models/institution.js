const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const institutionSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    manager: {
        type: String,
    },
    managerTel: {
        type: String
    }
},
{
    versionKey: false
})

module.exports = Institution = new mongoose.model('institution', institutionSchema)