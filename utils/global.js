var myFunction = {};

myFunction.brifIntronduction = function (content) {
    if (content) {
        if (content.length > 100) {
            return content.substring(0, 100) + '...';
        } else {
            return content;
        }
    }
}

module.exports = myFunction;