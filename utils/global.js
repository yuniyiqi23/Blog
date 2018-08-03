const helpFun = {};

helpFun.brifIntr = function (content) {
    if (content) {
        if (content.length > 100) {
            return content.substring(0, 100) + '...';
        } else {
            return content;
        }
    }
}

// 数据状态枚举
helpFun.DataState = {
    Draft: 0,
    Publish: 1,
    Delete: 2
}

module.exports = helpFun;