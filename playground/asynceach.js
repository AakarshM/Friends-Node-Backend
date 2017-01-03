/**
 * Created by Aakarsh on 1/2/17.
 */
var async = require('async');

var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var newArr;

function attemptAtAsyncEach (arr) {

     async.map(arr, function (member, callback) {
        callback(null, member + 1);
    }, function (err, results) {
        newArr = results;
         fn(newArr);
    });



}

function fn (a) {
    console.log(a);
}

//attemptAtAsyncEach(arr);


//METHOD 2


function plus1 (arr) {
    return Promise.all(arr.map(function (member) {
        return member+1;
    })).then((result) => console.log(result));

}

//plus1(arr);

// 3

var p1 = new Promise (function (res, rej){
    res(42);
})//.then((result) => {return result;});

console.log(p1);
//p1.then(res => console.log(res));