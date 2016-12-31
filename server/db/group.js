/**
 * Created by Aakarsh on 12/30/16.
 */

var mongoose = require('mongoose');

GroupSchema = mongoose.Schema({

    name: {
        Type: String
    },
    members: [
        {
            email: {
                type: String,
                unique: true
            }

        }
    ]

});


GroupSchema.statics.findbyID = function (id) { //Find the group user is involved in.
    var Group = this;
    return Group.findOne({'members._id':id}).then((groupUserIsIn) =>{
        return groupUserIsIn;
    });

};


GroupSchema.statics.addUserToGroup = function (groupID, userID, emailID) {
    var Group = this;
    return Group.findOne({_id: groupID}).then((group) => {

        if (!group) {
            return Promise.reject();
        }

        //else
        group.members.push({_id: userID, email: emailID});
        return group.save().then(() => {
            return group;
        }).catch((e) => {});


    }).catch((e) => {
        return Promise.reject()
    });
};


var Group = mongoose.model('Group', GroupSchema);

module.exports = Group;