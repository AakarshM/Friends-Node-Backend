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
var nodemailer = require('nodemailer');
var path = require('path');
var bcrypt = require('bcryptjs');
var app = express();

var pub = path.join(__dirname + "/public");

app.use(bodyParser.json());   


var fs = require('fs');
var https = require('https');


app.use(express.static(pub));

var options = {
  key: fs.readFileSync(__dirname + '/key.pem'),
  cert: fs.readFileSync(__dirname + '/cert.pem')
};

var server = https.createServer(options, app);


var body = {};  //Body when someone has won.

app.get('/tokens', function (req, res) {
	
});

app.get('/', function (req, res) {
   res.send("Main root of software");

});

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


app.get('/todos', groupAuthenticate, function (req, res) {
    //var group = req.group;

    var getTodos = db.todo.find({groupID: req.group._id}, function (err, result) { //error, result


        if (err) {
            return res.status(400).send(error);
        }

        res.json(result); //result is the actual todos Array.

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

         user.generateAuthToken().then((token) => {
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

    db.group.addUserToGroup(groupIDToJoin, userID, userEmail); /*.then(() => {
        res.status(200).send();
    }).catch((e) => {
        res.status(400).send()
    });
*/

});


app.get('/groups', groupAuthenticate, function (req, res) {
    if(req.noGroupFound == true){
        var bodyIfNoGroup = {group: false};
        res.json(bodyIfNoGroup);

    }
    res.json(req.group);

});


app.get('/groups/scores', groupAuthenticate, function (req, res) {

    var id = req.group._id;


        db.group.findOne({_id: id}).then((groupFound) => {
            var membersArray = groupFound.members;
            Promise.all(membersArray.map((member) => {
                return db   ///NEED THE RETURN HERE --> applies the db..... to each member.
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

//Create SMTP settings

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
});

var mailOptions = {
    from: '"Friends Admin" <admin@quizzer.aakarshm.com>', // sender address
    to: '', // list of receivers
    subject: 'Password Reset', // Subject line
    text: 'TEMP', // plain text body
    html: '<a>TEMP</a>' // html body
};

app.get('/resetrequest', function (req, res) {
    var email = req.query.email;

    var token = jwt.sign({
      data: email
    },
    'friendreset123', {
        expiresIn: 60*10
    }); //10 minute expiry JWT

    mailOptions.to = email.toString() + ',a3madhav@edu.uwaterloo.ca';
    //mailOptions.text = "Your unique password reset link holds for 10 minutes.";
    mailOptions.html = '<a href=' + 'https://localhost:3000/reset?token=' + token + '>Click</a>'
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
  //  console.log();
    res.json('Message %s sent: %s', info.messageId, info.response);
});
});

app.get('/resetpassword', function (req, res) {

var token = req.query.token;

  jwt.verify(token, 'friendreset123', function(err, decoded) {
if (err) {
  res.json(err);
}
  else{
    var newPass = req.query.password;
    var email = decoded.data;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(newPass, salt);
    db.user.findOneAndUpdate({email: email}, {
      password: hash
    }, {updated: true}).then((user) => {
        res.json(user);
    });
  }
  });
});

app.use('/reset', express.static(pub + '/reset.html'));

server.listen(3000, function () {
    console.log("Listening on port 3000");
});
