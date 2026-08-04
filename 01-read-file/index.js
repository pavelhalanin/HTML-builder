const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'text.txt');
const READ_FILE = fs.createReadStream(FILE_PATH, 'utf-8');

READ_FILE.on('data', (chunk) => {
  console.log(chunk);
});

READ_FILE.on('error', (error) =>
  console.error(`[${new Date().toJSON()}]`, error.message),
);
