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

function asyncThing(value) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(value * 2), 1000)
    })
        .then(function (a) {
            return a + 1;
        })
}

// async function main() {
//     return [1, 2, 3, 4].map(async (value) => {
//         const v = await asyncThing(value)
//         return v
//     })
// }

function main() {
    return Promise.all([1, 2, 3, 4].map((value) => asyncThing(value)))
}

main()
    .then(v => console.log(v))
    .catch(err => console.error(err))