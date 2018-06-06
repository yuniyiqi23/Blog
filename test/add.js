
const arr = [1, 2, 3, 4, 5];
var len = arr.length,
    i = 0;

// for (; i < len; ++i) {
//     arr[i] = sync(arr[i]);
//     console.log(arr[i]);
// }

// function sync(arr){
//     return arr + 1;
// }

function async(fn, callback) {
    // Code execution path breaks here.
    setTimeout(function () {
        try {
            callback(null, fn());
        }
        catch (err) {
            callback(err);
        }
    }, 0);
}

async(null, function (err, data) {
    if(err){
        
    }else{
        let 
    }
});

try {
    async(null, function (error, data) {
        if (error) {
            console.log(error.message);
        } else {
            // Do something.
        }
    });
} catch (err) {
    console.log('Error: %s', err.message);
}


