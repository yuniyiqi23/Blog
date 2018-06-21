var myFunction = {};  

myFunction.brifIntronduction = function(content) {
    let tag = '</p>';
    let arr = content.split(tag);
    let intro;
    if (arr.length > 0) {
        if (arr.length == 1) {
            intro = arr[0] + tag;
        } else if (arr.length == 2) {
            intro = arr[0] + tag + arr[1] + tag;
        } else if (arr.length > 2) {
            intro = arr[0] + tag + arr[1] + '...' + tag;
        }
    }

    return intro;
}

// myFunction

module.exports = myFunction;