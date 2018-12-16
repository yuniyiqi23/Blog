const winston = require('winston');
const moment = require('moment');

// set default log level.
const logLevel = 'info'

// Set up logger
const customColors = {
  trace: 'white',
  debug: 'green',
  info: 'blue',
  warn: 'yellow',
  crit: 'red',
  fatal: 'red'
}

const logger = new (winston.Logger)({
  colors: customColors,
  level: logLevel,
  levels: {
    fatal: 0,
    crit: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5
  },
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      timestamp: true,
      timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss')
    }),
    new (winston.transports.File)({ 
      filename: './logs/blog.log',
      timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss') 
    })
  ]
})

winston.addColors(customColors)

// Extend logger object to properly log 'Error' types
const origLog = logger.log

logger.log = function (level, msg) {
  if (msg instanceof Error) {
    const args = Array.prototype.slice.call(arguments)
    args[1] = msg.stack
    origLog.apply(logger, args)
  } else {
    origLog.apply(logger, arguments)
  }
}
/* LOGGER EXAMPLES
  const log = require('./log.js')
  log.trace('testing')
  log.debug('testing')
  log.info('testing')
  log.warn('testing')
  log.crit('testing')
  log.fatal('testing')
 */

module.exports = logger;
