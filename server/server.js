/**
 * Created by Aakarsh on 12/28/16.
 */

//Using ES6

var db = require('./db/mongoose.js');
var express = require('express');
var bodyParser = require('body-parser');
var {authenticate, groupAuthenticate} = require('./db/middleware.js');
var {SHA256} = require('crypto-js');
var jwt = require('jsonwebtoken');
var {ObjectId} = require('mongoose');
var async = require("async");
var _ = require('underscore');
var app = express();
app.use(bodyParser.json());


var body = {};  //Body when someone has won.


app.post('/todos', groupAuthenticate, function (req, res) {
    var group = req.group; //group the user belongs to.
    var groupID = group._id;
    var body = req.body;
    var text = body.text;
    var completed = body.completed;
    var newTodo = new db.todo({
        text,
        completed,
        groupID
    });

    newTodo.save().then(() => {
        res.json(group)
    });

});


app.get('/todos', authenticate, function (req, res) {

    var getTodos = db.todo.find({_creator: req.user._id}, function (err, result) { //error, result


        if (err) {
            return res.status(400).send(error);
        }

        res.json(result);

    });

    return getTodos;


});


app.get('/todos/:id', authenticate, function (req, res) {
    var id = req.params.id;
    var userID = req.user._id;

    //   if (!db.objectID(id).isValid()) {
    //     return res.status(404).send();
    //}

    db.todo.find({'allowedToView.userID': userID, _id: id}, function (err, result) {
        if (err) {
            return res.status(400).send("error");
        }
        res.json(result);

    });

});

app.post('/todos/donetodos/:id', groupAuthenticate, function (req, res) {
    var toPatchID = req.params.id;
    var groupID = req.group._id;
    var user = req.user;

    db.todo.findOne({groupID: groupID, _id: toPatchID}).then((todoFound) => {

        body = {
            groupID: groupID,
            text: todoFound.text,
            victor: {email: user.email,
            _id: user._id.toString()},
            completedAt: new Date().toLocaleString().toString()
        };

        var toAddToDoneTodo = new db.doneTodo(body);
        toAddToDoneTodo.save().then((result) => {


            ////////// BEGIN DELETE FROM MAIN TO-DO
            db.todo.remove({groupID: body.groupID, _id: toPatchID}, function (err, result) {
                if (err) {
                    return console.log("error");
                }

            }).then(() => res.status(200).send()).catch((e) => res.status(400).send());

/////////// END DELETE FROM MAIN TO-DO
        });


    }).catch((e) => {
        res.status(400).send()
    });
});


app.patch('/todos/:id', groupAuthenticate, function (req, res) {
    var toPatchID = req.params.id;
    var groupID = req.group._id;
    var user = req.user;
    var fetchedTodo;
    /*The body will be of the form
     {
     completed: true
     }

     The body that will be sent to the update will be like

     {
     completed: true,
     completerID: ...,
     completerEmail: ...,
     completeTime: timestamp

     }

     */

    db.todo.findOne({groupID: groupID, _id: toPatchID}).then((todoFound) => {

        body = {
            groupID: groupID,
            text: todoFound.text,
            victor: user.email,
            completedAt: new Date().toDateString().toString()
        };

        var toAddToDoneTodo = new db.doneTodo(body);
        toAddToDoneTodo.save().then((result) => {

            db.todo.remove({groupID: groupID, _id: toPatchID}, function (err, result) {
                if (err) {
                    return console.log("error");
                }

            }).then(() => res.status(200).send());

        });


    }).catch((e) => {
        res.status(400).send()
    });


});


///////SIGN UP USERS

app.post('/users', function (req, res) {
    var body = req.body;  //{email, password}

    var user = new db.user(
        {
            email: body.email,
            password: body.password
        }
    );

    user.save().then(function () {
        return user.generateAuthToken();
    }).then(function (token) {
        console.log(JSON.stringify(user, null, 3));
        res.header('x-auth', token).send(user);

    }).catch((e) => {
        res.status(400).send(e)
    })


});


//Login users

app.post('/users/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    //Find the user's hashed pass in the database

    db.user.findByCredentials(email, password).then((user) => {

        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);

        });

    }).catch((e) => {
        res.status(401).send()
    });


});


//Logout users

app.delete('/users/me/token', authenticate, function (req, res) {
    req.user.removeToken(req.token).then(()=> {
        res.status(200).send(); //all ok
    }).catch((e) => {
        res.status(400).send()
    });


});


//user profile (me) requiring auth

app.get('/users/me', authenticate, function (req, res) {
    res.send(req.user);
});


//user profile friends

app.get('/users/me/friends', authenticate, function (req, res) {
    var userID = req.user._id;
    db.user.find({_id: userID}).then((user) => {
        res.json(user.friends);
    }).catch((e)=> {
        res.status(400).send()
    });

});


app.get('/find/:id', function (req, res) {
    var id = req.params.id;
    var friendUser;
    db.user.findOne({_id: id}).then((friend) => {
        friendUser = friend;
        console.log(friend);
        res.json(friendUser);
    });

});

app.get('/tests', function (req, res) {
   function g(){
       return db.user.findOne({_id: '5866b30be493368fcf73fadb'}).then((friend) => {
        return friend.toString();
       });
   }

   console.log(g());


});


/*
 app.post('/users/me/friends', authenticate, function (req, res) {

 var user = req.user;
 var friendID = req.body.id;
 var friendEmail = req.body.email;
 var friendUser;
 db.user.findOne({_id: friendID}).then((friend) => {
 friendUser = friend;
 console.log(friendUser);
 }).catch((e) => res.status(400).send(e)); //friend collection.



 // Add friend in JSON format ---->   {id: ....., name: ....} //all friend properties.

 return user.addFriend(friendID, friendEmail).then((userFriends) => {
 return friendUser.addFriend(user._id, user.email).then(() => {
 res.status(200).send();
 });

 }).catch((e) => {
 res.status(400).send(e)
 });


 });
 */

app.post('/groups', authenticate, function (req, res) { //create group
    var user = req.user;
    var group = req.body;

    var newGroup = new db.group({
        name: group.name,
        members: [{
            _id: user._id.toString(),
            email: user.email.toString()

        }]
    });

    newGroup.save().then((result) => {
        res.status(200).send(result)
    });


});

app.post('/groups/join/:id', authenticate, function (req, res) {
    var groupIDToJoin = req.params.id;
    var userID = req.user._id;
    var userEmail = req.user.email;
    console.log(groupIDToJoin + userEmail + userID);

    db.group.addUserToGroup(groupIDToJoin, userID, userEmail).then(() => {
        res.status(200).send();
    }).catch((e) => {
        res.status(400).send()
    });


});


app.get('/groups', groupAuthenticate, function (req, res) {
    res.json(req.group);

});

app.get('/groups/:groupID', authenticate, function (req, res) { //Info of any group


});


app.get('/groups/:id/scores', groupAuthenticate, function (req, res) {

    var id = req.params.id;

        db.group.findOne({_id: id}).then((groupFound) => {
            var membersArray = groupFound.members;
            Promise.all(membersArray.map((member) => {
                return db
                    .doneTodo
                    .find({'victor._id': member._id})
                    .then((userVictories) => {
                        return {
                            email: member.email,
                            victories: userVictories.length
                        }
                    });
            })).then( function (result) {
                new Promise(function (resolve, reject) {

                    result.sort(function (a, b) {
                        if(a.victories < b.victories){
                            return 1
                        }
                        if(a.victories > b.victories){
                            return -1
                        }
                        if(a.victories = b.victories){
                            return 0
                        }
                    });

                    resolve(result);


                }).then((sorted) => res.json(sorted));


            })

        });



});


app.listen(3000, function () {
    console.log("Listening on port 3000");
});
