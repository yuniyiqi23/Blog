

// (function contain(arr, value) {
//     console.log(1);
//     if (Array.prototype.includes) {
//         return arr.includes(value);
//     }
//     return arr.some(el => el === value);
// });

// const contains = (() =>  
//     Array.prototype.includes
//         ? (arr, value) => arr.includes(value)
//         : (arr, value) => arr.some(el => el === value)
// )();
// console.log(global.con); // => false

// function mixFunction(a) {
//     var result = [], i, n;
//     n = a.length;
//     for (i = 0; i < n; i++) {
//         (function (j) {
//             result[i] = function () {
//                 //Closure对外部变量是引用
//                 console.log("for i=" + i);
//                 return a[j];//a[i-1]
//             }
//         })(i)
//     }
//     return result;
// }
// var mixcall = mixFunction([10, 20, 30]);
// // console.log(mixcall);
// var f = mixcall[0];
// console.log(mixcall[0]());//?应该输出什么值

// const a = {
//     name: 'Adam'
// };
// a.age = 'asd';

// var getTempItem = id => id;

// console.log([1,2,3].map(x => x * x));

var wm = new WeakMap();
var element = document.querySelector(".element");

wm.set(element, "Original");
wm.get(element) // "Original"

element.parentNode.removeChild(element);
element = null;
wm.get(element) // undefined