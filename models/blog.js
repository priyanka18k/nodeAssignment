const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title : {
        type :String,
        required : true
    },
    body : {
        type :String,
        required : true
    },
    image : {
        type :String,
        required : true
    },
    userId : [{ type: mongoose.Schema.Types.ObjectId, ref: 'userSchema' }]
});

module.exports = mongoose.model('blogSchema',blogSchema);