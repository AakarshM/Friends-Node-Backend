/**
 * Created by Aakarsh on 12/30/16.
 */

var mongoose = require('mongoose');


var DoneTodoSchema = new mongoose.Schema({

    groupID: {
        type: String
    },
    text:{
      type: String
    },

    victor: {
        email: {type: String}, //emailID of winner
        _id: {type: String}
    },

    completedAt:{
        type: String
    }


});

var DoneTodo = mongoose.model('DoneTodo', DoneTodoSchema);


module.exports = DoneTodo;