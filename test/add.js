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

const wait = (ms) => new Promise(res => setTimeout(res, ms));

var takeLongTime = function () {
    return new Promise(function (res) {
        setTimeout(function () {
            res(123);
        }, 1000);
    });
}

const startAsync = async callback => {
    await takeLongTime();
    callback('Hello');
    await takeLongTime();
    callback('To Async Await Using TypeScript');
};

// startAsync(text => console.log(text));

function delay() {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve('qweqw')
        }, 2000)
    })
}

// delay().then(function (value) {
//     console.log(value);
// })

function testSometing() {
    console.log("执行testSometing");
    return "testSometing";
}

async function testAsync() {
    console.log("执行testAsync");
    return Promise.resolve("hello async");
}

async function test() {
    console.log("test start...");
    const v1 = await testSometing();//关键点1
    console.log(v1);
    const v2 = await testAsync();
    console.log(v2);
    console.log(v1, v2);
}

test();

var promise = new Promise((resolve) => { console.log("promise start.."); resolve("promise"); });//关键点2
promise.then((val) => console.log(val));

console.log("test end...")