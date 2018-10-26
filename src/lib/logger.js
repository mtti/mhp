const winston = require('winston');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(i => `${i.timestamp} ${i.level.toUpperCase()} ${i.message}`)
  ),
  transports: [
    new winston.transports.Console(),
  ]
});

module.exports = logger;
