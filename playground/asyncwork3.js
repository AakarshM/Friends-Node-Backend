/**
 * Created by Aakarsh on 12/31/16.
 */


function  f () {
   return new Promise(function (resolve, reject) {

        resolve(4);
    })
}

var a =[1, 2, 3, 4, 5];

function  g () {
    Promise.all(a.map((member)=>{
        return f().then((res) => {return res;})

    })).then((result)=>{console.log(result)});

 //NEED return to execute g();

}

/////MAP gets the simple value.

g();




////// ANY RETURN INSIDE A "THEN" STATEMENT IS PROMISE, MUST HAVE "THEN" AGAIN