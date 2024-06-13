import fs from 'fs';
import path from 'path';

// Central error handler for all errors, write to error.log
const errorHandler = (error, req, res, next) => {
  const logDirectory = path.join(__appdir, 'logs');
  const filePath = path.join(logDirectory, 'error.log');

  // Ensure the logs directory exists
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }

  // Create a consistent timestamp
  const now = new Date();
  const timestamp = `${now.toLocaleDateString('sv-SE')} ${now.toLocaleTimeString('sv-SE')}`;

  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'internal server error';

  const message = `${timestamp},
    Method: ${req.method},
    URL: ${req.originalUrl},
    Status: ${error.statusCode},
    Success: false,
    Message: ${error.message}\n`;

  // Append the error log message to the file, handling errors
  fs.appendFile(filePath, message, (err) => {
    if (err) {
      console.error('Error writing to error log file:', err);
    }
  });

  res.status(error.statusCode).json({ message: error.message });
};

export default errorHandler;
