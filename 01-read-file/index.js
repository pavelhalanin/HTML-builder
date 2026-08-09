const fs = require('fs');
const path = require('path');

class Task01Helper {
  static logScore() {
    console.log(
      [
        `\n< < < < < < < <`,
        `Task 01 Read File [40 / 40]`,
        'EN',
        `- [x] 20 / 20 Running 'node 01-read-file' from the repository root prints the contents of 01-read-file/text.txt to the console`,
        `- [x] 20 / 20 File reading is implemented with ReadStream; no synchronous fs calls are used`,
        `RU:`,
        `- [x] 20 / 20 Запуск 'node 01-read-file' из корня репозитория выводит содержимое 01-read-file/text.txt в консоль`,
        `- [x] 20 / 20 Чтение файла реализовано с помощью ReadStream; синхронные вызовы fs не используются`,
        `> > > > > > > >\n`,
      ].join('\n'),
    );
  }

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
    Task01Helper.logScore();

    const FILE_PATH = path.join(__dirname, 'text.txt');
    const FILE_CONTENT = await Task01Helper.getFileContentByPath(FILE_PATH);

    console.log(`File content "${FILE_PATH}":`);
    console.log(FILE_CONTENT);
  } catch (exception) {
    console.error(exception);
  }
}

main();
