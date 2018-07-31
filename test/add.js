function getURL(URL) {
    return new Promise(function (resolve, reject) {
        // console.log('URL : ' + URL);
        setTimeout(function(){
            resolve(111);
        }, 1000)
        
    });
}
var request = {
    comment: function getComment() {
        return getURL('http://getComment/comment.json');
    },
    people: function getPeople() {
        return getURL('http://getPeople/people.json');
    }
};
function main() {
    return Promise.all([request.comment(), request.people()]);
}
// 运行示例
main().then(function (value) {
    console.log(value);
    return Promise.resolve(222);
}).then(function (res) {
    console.log(res);
});

// var obj = new Proxy({}, {
//     get: function (target, key, receiver) {
//         console.log(`getting ${key}!`);
//         return Reflect.get(target, key, receiver);
//     },
//     set: function (target, key, value, receiver) {
//         console.log(`setting ${key}!`);
//         return Reflect.set(target, key, value, receiver);
//     }
// });

// console.log(obj.count = 1);