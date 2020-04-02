const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName : {
        type : String,
        require : true
    },
    lastName : {
        type: String,
        require : true
    },

    email : {
        type : String,
        require: true
    },

    password : {
        type : String,
        require: true
    },

    creationDate : {
        type : Date,
        default: Date.now()
    },



});


module.exports = {User : mongoose.model('user',UserSchema)};