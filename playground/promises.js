/**
 * Created by Aakarsh on 1/3/17.
 */


var arr = [1,2 ,3, 4, 5, 6, 67, 8, 10];

function f1 () {

   return arr.map(function (member) {

        return Promise.resolve(member + 2).then((result) => {return result + 2}).then
        (value => {return value + 1});

    });



}

Promise.all(f1()).then((res) => {console.log(res)});
