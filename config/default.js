'use strict';

const development = require('./development');
const production = require('./production');
/**
 * 判断当前指示当前环境的常量返回对应配置
 * 默认返回开发环境的配置
 */
module.exports = {

  session: {
    secret: 'adamblogsecret',
    key: 'adamblogkey',
    maxAge: 604800000//7 days
  },

  mongodb: 'mongodb://localhost:27017/myblog',

  deployEnv: function () {
    console.log('process.env.NODE_ENV : ' + process.env.NODE_ENV);
    switch (process.env.NODE_ENV) {
      case 'development':
        return development;
        break;
      case 'production':
        return production;
        break;
      default:
        return development;
    }
  }
}

