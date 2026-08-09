const fs = require('fs');
const path = require('path');

class Task05Helper {
  static logScore() {
    console.log(
      [
        `\n< < < < < < < <`,
        `Task 05 Merge styles`,
        'EN',
        `- [x] 0 / 20 After running 'node 05-merge-styles', project-dist/bundle.css exists and contains the concatenated contents of every .css file inside 'styles'`,
        `- [x] 0 / 10 Files with extensions other than .css and any subdirectories inside 'styles' are ignored`,
        `- [x] 0 / 15 Rerunning the script overwrites bundle.css with the up-to-date content of 'styles'`,
        `RU:`,
        `- [x] 0 / 20 После запуска 'node 05-merge-styles' project-dist/bundle.css существует и содержит объединённое содержимое всех файлов .css внутри 'styles'`,
        `- [x] 0 / 10 Файлы с расширениями, отличными от .css, и любые подпапки внутри 'styles' игнорируются`,
        `- [x] 0 / 15 Повторный запуск скрипта перезаписывает bundle.css актуальным содержимым 'styles'`,
        `> > > > > > > >\n`,
      ].join('\n'),
    );
  }

  static async getCssFilePathByPath(dir) {
    const ARRAY_CSS_PATH = [];
    const ITEMS = await fs.promises.readdir(dir);

    for (const ITEM of ITEMS) {
      const FULL_PATH = path.join(dir, ITEM);
      const STAT = await fs.promises.stat(FULL_PATH);

      const IS_DIRECTORY = STAT.isDirectory();

      if (IS_DIRECTORY) {
        continue;
      }

      const IS_CSS_FILE = path.extname(ITEM) === '.css';

      if (IS_CSS_FILE) {
        ARRAY_CSS_PATH.push(FULL_PATH);
      }
    }

    return ARRAY_CSS_PATH;
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

  static getDateTimePrefix() {
    const DATE_TIME = new Date().toJSON().slice(0, 19).replace('T', ' ');
    return `[${DATE_TIME}] `;
  }

  static log(log) {
    const DATE_TIME_PREFIX = this.getDateTimePrefix();
    console.log(`${DATE_TIME_PREFIX}${log}`);
  }

  static async bundle(BUNDLE_FILE_PATH, CSS_FOLDER_PATH) {
    const ARRAY_CSS_PATH = await this.getCssFilePathByPath(CSS_FOLDER_PATH);

    this.log('{ Start bundle css');

    const WRITE_STREAM = fs.createWriteStream(BUNDLE_FILE_PATH, 'utf-8');

    WRITE_STREAM.on('error', (err) => {
      this.log(`Error writing to bundle: ${err.message}`);
    });

    const FINISH_WRITE_STREAM_PROMISE = new Promise((resolve) => {
      WRITE_STREAM.on('finish', resolve);
    });

    for (let i = 0; i < ARRAY_CSS_PATH.length; i++) {
      const CSS_PATH = ARRAY_CSS_PATH[i];

      this.log(`- add to bundle: ${CSS_PATH}`);
      const TEXT = await this.getFileContentByPath(CSS_PATH);
      WRITE_STREAM.write(TEXT);
    }

    WRITE_STREAM.end();
    await FINISH_WRITE_STREAM_PROMISE;
    this.log('} End bundle css');
  }
}

async function main() {
  try {
    Task05Helper.logScore();

    const BUNDLE_FILE_PATH = path.join(__dirname, './project-dist/bundle.css');
    const CSS_FOLDER_PATH = path.join(__dirname, './styles');
    Task05Helper.bundle(BUNDLE_FILE_PATH, CSS_FOLDER_PATH);
  } catch (exception) {
    console.error(exception);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { Task05Helper };
