const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
   title : {
       type : String,
       require : true
   },

   file : {
    type : String,
    require : true
   },


    status : {
       type: String,
        default : 'public'
    },

    description : {
       type : String,
        require: true
    },

    creationDate : {
       type : Date,
        default: Date.now()
    },

    user : {
       type : Schema.Types.ObjectId,
        ref : 'user'
    },

    category : {
        type : Schema.Types.ObjectId,
        ref : 'category'
    },

    comments : [
        {
            type : Schema.Types.ObjectId,
            ref : 'comment'
        }
    ],

    allowcomments : {
       type : Boolean,
        default : false
    }

});


module.exports = {Post : mongoose.model('post',PostSchema)};