const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email : {
        type :String,
        required : true
    },
    name : {
        type :String,
        required : true
    },
    password : {
        type :String,
        required : true
    },
    token : {
        type :String
    },
    status : {
        type :String
    }
});

module.exports = mongoose.model('userSchema',userSchema);