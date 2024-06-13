import fs from 'fs';
import path from 'path';

const logger = (req, res, next) => {
  const logDirectory = path.join(__appdir, 'logs');
  const filePath = path.join(logDirectory, 'app.log');

  // Ensure the logs directory exists
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }

  // Create a consistent timestamp
  const now = new Date();
  const timestamp = `${now.toLocaleDateString('sv-SE')} ${now.toLocaleTimeString('sv-SE')}`;
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  const message = `${req.method} ${url} - ${timestamp}\n`;

  // Append the log message to the file, handling errors
  fs.appendFile(filePath, message, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });

  next();
};

export default logger;
