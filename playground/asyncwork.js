var z = 0;

var arr = [];

arr.push({
    victories: 2}, {victories: 10}, {victories: 1});

new Promise(function (resolve, reject) {
    arr.sort(function (a, b) {
        if(a.victories < b.victories){
            return -1
        }
        if(a.victories > b.victories){
            return 1
        }
        if(a.victories = b.victories){
            return 0
        }
    });

    resolve(arr);


}).then((sorted) => console.log(sorted));
