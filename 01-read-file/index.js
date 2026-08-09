const fs = require('fs');
const path = require('path');

class Task01Helper {
  static getFileContentByPath(filePath) {
    return new Promise((resolve, reject) => {
      const CHUNKS = [];
      const READ_STREAM = fs.createReadStream(filePath, 'utf-8');

      READ_STREAM.on('data', (chunk) => {
        CHUNKS.push(chunk);
      });

      READ_STREAM.on('end', () => {
        resolve(CHUNKS.join(''));
      });

      READ_STREAM.on('error', (err) => {
        reject(err);
      });
    });
  }
}

async function main() {
  try {
    const FILE_PATH = path.join(__dirname, 'text.txt');
    const FILE_CONTENT = await Task01Helper.getFileContentByPath(FILE_PATH);

    console.log(`File content "${FILE_PATH}":`);
    console.log(FILE_CONTENT);
  } catch (exception) {
    console.error(exception);
  }
}

main();
