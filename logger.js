const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',  // 해당 심각도 이상의 로그 기록
  format: format.json(),
  transports: [
	new transports.File({ filename: 'combined.log' }),
	new transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({ format: format.simple() }));
}