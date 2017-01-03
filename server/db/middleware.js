/**
 * Created by Aakarsh on 12/28/16.
 */

var _ = require('underscore');
var db = require('./mongoose.js');

var middleWareFunctions = {}; //define middleware object (cont. functions)

var authenticate = function (req, res, next) {

    var token = req.header('x-auth');
    db.user.findByToken(token).then((result) => {

        if (!result) { //No found user.
            return Promise.reject();
        }
        req.user = result;  //the result is the user from findByToken
        req.token = token;
        next(); //Otherwise the other route won't run.

        ///The above req gets passed in to main route (this is the middle-ware).
    }).catch((e) => {
        res.status(401).send();
    });

};


var groupAuthenticate = function (req, res, next) {
    var token = req.header('x-auth');
    db.user.findByToken(token).then((result) => {  //result is the user of the token.

        if (!result) { //No found user.
            return Promise.reject();
        }

        db.group.findbyID(result._id.toString()).then((group) =>{

            if(!group){
                req.noGroupFound = true;
            }

            req.noGroupFound = false;
            req.user = result;  //the result is the user from findByToken
            req.group = group;
            req.token = token;
            next();
        });
      //Otherwise the other route won't run.

        ///The above req gets passed in to main route (this is the middle-ware).
    }).catch((e) => {
        res.status(401).send(e);
    });

};

middleWareFunctions.authenticate = authenticate;
middleWareFunctions.groupAuthenticate = groupAuthenticate;

module.exports = middleWareFunctions;

