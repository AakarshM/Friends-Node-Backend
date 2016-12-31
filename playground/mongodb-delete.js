/**
 * Created by Aakarsh on 12/28/16.
 */

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', function (err, db) { //error, db object, used to read/write data.
    if (err) {
        return console.log("Unable to connect to MongoDB"); //return makes program stop, stops from the next line.Could use else.
    }
    console.log("Connected to MongoDB");


    /////DELETEMANY

    /*
    db.collection('Todos').deleteMany(
        {
            text: "one"
        }

    ).then(function (result) {
      //  console.log(result); <-- GARBAGE
    }).catch(function (error) {
        console.log(error);
    });
    /////

    ////// DELETEONE

    db.collection('Todos').deleteOne(

        {text: "gar"}

    ).catch(function (er) {
        console.log(er);
    });
    */


    db.collection('Todos').findOneAndUpdate({
       _id: new ObjectID("5863657b023e30b9f2bf5cad")
    },   {

        $set:{
            completed: true
        }

    }, {returnOriginal: false}).then(function (result) {
        console.log(JSON.stringify(result, null, 3))
    }).catch(function (e) {
        console.log(e);
    });  //will not return original


    db.close();


    ///// findOneAndDelete
});