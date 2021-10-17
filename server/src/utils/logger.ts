import fs from 'fs';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const logDir = __dirname + '/../logs';
!fs.existsSync(logDir) && fs.mkdirSync(logDir);

const { combine, timestamp, printf } = winston.format;
const logFormat = printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    logFormat
  ),
  transports: [
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/info',
      filename: `%DATE%.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error',
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true
    })
  ]
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.splat(), winston.format.colorize(), winston.format.simple())
  })
);

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  }
};

export { logger, stream };
