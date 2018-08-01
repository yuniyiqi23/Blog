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

if (typeof DataState == "undefined") {
    var DataState = {};
    DataState.Normal = 0;
    DataState.Publish = 1;
    DataState.Delete = 2;
}

module.exports = {
    myFunction: myFunction,
    DataState: DataState
};