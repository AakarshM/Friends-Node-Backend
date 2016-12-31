/**
 * Created by Aakarsh on 12/29/16.
 */

var b = require('bcryptjs');
var jwt = require('jsonwebtoken');

var password = "123abc!";

b.genSalt(10, (err, salt) => {
    b.hash(password, salt, (err, hash) =>{

       //console.log(hash);

    });

  var hashedPassword = "$2a$10$M6Cn9INQxwHmQupnMAdLRurd4EHXIqahWMYzaKPc62lnica1bHQiu";

    b.compare(password, hashedPassword, (err, result) => {  //(plain text, hashed, lets you know)
        //result == true if match, else false.
        console.log(result);

    });

});