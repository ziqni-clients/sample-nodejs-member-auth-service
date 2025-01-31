const winston = require('winston');

// Create a custom format for log messages
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create the logger instance
const logger = winston.createLogger({
  level: 'info', // Set the default log level
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to each log entry
    logFormat // Apply the custom format
  ),
  transports: [
    new winston.transports.Console({ // Output logs to console
      format: winston.format.combine(
        winston.format.colorize(), // Colorize log messages
        winston.format.simple() // Simplified log output format for the console
      )
    }),
    new winston.transports.File({ // Output logs to a file
      filename: 'logs/application.log', // Specify the log file location
      maxsize: 5242880, // 5MB max size per log file
      maxFiles: 5, // Keep up to 5 log files
      tailable: true, // Keep the latest logs and overwrite old ones
    })
  ]
});

module.exports = logger;
