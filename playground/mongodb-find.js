/**
 * Created by Aakarsh on 12/28/16.
 */


const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', function (err, db) { //error, db object, used to read/write data.
    if(err){
        return console.log("Unable to connect to MongoDB"); //return makes program stop, stops from the next line.Could use else.
    }
    console.log("Connected to MongoDB");

    /* Find all (no cond.)
    db.collection('Todos').find().toArray().then(function (found) {
        console.log(found);
    }).catch(function (e) {
        console.log(e);
    });  //With no args, it'll find everything.
        */

    // Find with cond (true)

    /*
    db.collection('Todos').find(
        {
            completed: true
        }
    ).toArray().then(function (foundTodos) {
        console.log(JSON.stringify(foundTodos, null, 3));
    }).catch(function (e) {
        console.log(e); //Error
    });

    */


    /////////// FIND USERS WITH NAME: AAKARSH MADHAVAN

    db.collection('Users').find(
        {
            "name": "Aakarsh Madhavan"
        }).toArray(function (err, result) {
        if(err){
            return console.log(err);
        }
        console.log(result.length);

    });


    db.close(); //Closes mongoDB connection

});