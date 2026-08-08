const fs = require('fs');
const path = require('path');

class Task06Helper {
  static async getCssFilePathByPath(dir) {
    const ARRAY_CSS_PATH = [];
    const ITEMS = await fs.promises.readdir(dir);

    for (const ITEM of ITEMS) {
      const FULL_PATH = path.join(dir, ITEM);
      const STAT = await fs.promises.stat(FULL_PATH);

      const IS_DIRECTORY = STAT.isDirectory();

      if (IS_DIRECTORY) {
        const SUB_FILES = await this.getCssFilePathByPath(FULL_PATH);
        ARRAY_CSS_PATH.push(...SUB_FILES);
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
}

class LogHelper {
  static getDateTimePrefix() {
    const DATE_TIME = new Date().toJSON().slice(0, 19).replace('T', ' ');
    return `[${DATE_TIME}] `;
  }

  static log(log) {
    const DATE_TIME_PREFIX = this.getDateTimePrefix();
    console.log(`${DATE_TIME_PREFIX}${log}`);
  }
}

async function main() {
  try {
    const BUNDLE_FILE_PATH = path.join(__dirname, './project-dist/bundle.css');
    const CSS_FOLDER_PATH = path.join(__dirname, './test-files');

    const ARRAY_CSS_PATH =
      await Task06Helper.getCssFilePathByPath(CSS_FOLDER_PATH);

    LogHelper.log('{ Start bundle css');

    const WRITE_STREAM = fs.createWriteStream(BUNDLE_FILE_PATH, 'utf-8');

    WRITE_STREAM.on('error', (err) => {
      LogHelper.log(`Error writing to bundle: ${err.message}`);
    });

    const FINISH_WRITE_STREAM_PROMISE = new Promise((resolve) => {
      WRITE_STREAM.on('finish', resolve);
    });

    for (let i = 0; i < ARRAY_CSS_PATH.length; i++) {
      const CSS_PATH = ARRAY_CSS_PATH[i];

      LogHelper.log(`- add to bundle: ${CSS_PATH}`);
      const TEXT = await Task06Helper.getFileContentByPath(CSS_PATH);
      WRITE_STREAM.write(TEXT);
    }

    WRITE_STREAM.end();
    await FINISH_WRITE_STREAM_PROMISE;
    LogHelper.log('} End bundle css');
  } catch (exception) {
    LogHelper.log(exception);
    process.exit(1);
  }
}

main();
