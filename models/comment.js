var mongoose = require('mongoose')

var commentSchema = new mongoose.Schema({
    text:String,
    // in order to associate the author with comments,create object
    author: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    }
})

module.exports = mongoose.model('Comment',commentSchema)