/**
 * Created by Aakarsh on 12/28/16.
 */

var {SHA256} = require('crypto-js');
var jwt = require('jsonwebtoken');

var data = {

    id: 10
}

var token = jwt.sign(data, "123abc"); //creates the hash, returns token value (data, secret) <-- Returns token


try {
    jwt.verify(token, "123ab c")
} catch (e){
    console.log(JSON.stringify(e, null, 4));

}
 //takes token/secret and verifies data was not manipulated.

console.log(token);

/*
var message = "I am user number 3";
var hash = SHA256(message).toString();

console.log("Message: " + message);
console.log("Hash: " + hash);

var data = {
    id: 4 //User id of the logged in user
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'Somesecret').toString()


};

//Salting a hash means adding something to it but adding it unique.

token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

var resultHash =  SHA256(JSON.stringify(token.data) + 'Somesecret').toString();

if(resultHash == token.hash){
    console.log("True, both hashes matcheds");
} else{
    console.log("False, hashes dont match");
}
    */