// function getURL(URL) {
//     return new Promise(function (resolve, reject) {
//         // console.log('URL : ' + URL);
//         setTimeout(function(){
//             resolve(111);
//         }, 1000)

//     });
// }
// var request = {
//     comment: function getComment() {
//         return getURL('http://getComment/comment.json');
//     },
//     people: function getPeople() {
//         return getURL('http://getPeople/people.json');
//     }
// };
// function main() {
//     return Promise.all([request.comment(), request.people()]);
// }
// // 运行示例
// main().then(function (value) {
//     console.log(value);
//     return Promise.resolve(222);
// }).then(function (res) {
//     console.log(res);
// });

const list = [];
for (let i = 0; i < 10; ++i) {
    list.push(i);
}

function PromiseForEach(arr, cb) {
    let realResult = []
    let result = Promise.resolve()
    arr.forEach((a, index) => {
        result = result.then(() => {
            return cb(a).then((res) => {
                realResult.push(res)
            })
        })
    })

    return result.then(() => {
        return realResult
    })
}

PromiseForEach(list, (number) => {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // console.log(number);
            return resolve(number);
        }, 100);
    })

}).then((data) => {
    console.log("成功");
    console.log(data);
}).catch((err) => {
    console.log("失败");
    console.log(err)
}); 
