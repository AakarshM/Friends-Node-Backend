/**
 * Created by Aakarsh on 12/28/16.
 */

//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');
// var obj = new ObjectID(); Can generate object ID's
// console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', function (err, db) { //error, db object, used to read/write data.
    if(err){
        return console.log("Unable to connect to MongoDB"); //return makes program stop, stops from the next line.Could use else.
    }
    console.log("Connected to MongoDB");

    //CREATE SOME COLLECTIONS

    /*
    db.collection('Todos').insertOne(
        {text: "something to do",
         completed: false },
    function(err, result){
             if(err){
                 return console.log("Unable to input todo ", err);

             }
             console.log(JSON.stringify(result.ops, undefined, 3))

    });
    */

    //create user collection

    db.collection('Users').insertOne(
        {
            name: "Aakarsh Madhavan",
            age: 18,
            location: "Waterloo, ON, Canada"
        },

        function (err, result) {
            if(err){
                return console.log("Error in creating user ", err);
            }
           // console.log(JSON.stringify(result.ops, undefined, 3));
            console.log(result.ops[0]._id.getTimestamp());

        }
    );


    db.close(); //Closes mongoDB connection

}); //Can assign a new name (eg TodoApp)