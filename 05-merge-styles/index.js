const {
  createReadStream,
  createWriteStream,
  promises: fsPromises,
} = require('fs');
const path = require('path');

class Task05Helper {
  static async getCssFilePathByPath(dir) {
    const ARRAY_CSS_PATH = [];
    const ITEMS = await fsPromises.readdir(dir);

    for (const ITEM of ITEMS) {
      const FULL_PATH = path.join(dir, ITEM);
      const STAT = await fsPromises.stat(FULL_PATH);

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
      const READ_STREAM = createReadStream(filePath, 'utf-8');

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

  static async createBundleCss(BUNDLE_FILE_PATH, CSS_FOLDER_PATH) {
    const ARRAY_CSS_PATH = await this.getCssFilePathByPath(CSS_FOLDER_PATH);

    console.log(`{ Create bundle ${BUNDLE_FILE_PATH}`);

    const WRITE_STREAM = createWriteStream(BUNDLE_FILE_PATH, 'utf-8');

    WRITE_STREAM.on('error', (err) => {
      console.log(`Error writing to bundle: ${err.message}`);
    });

    const FINISH_WRITE_STREAM_PROMISE = new Promise((resolve) => {
      WRITE_STREAM.on('finish', resolve);
    });

    for (let i = 0; i < ARRAY_CSS_PATH.length; i++) {
      const CSS_PATH = ARRAY_CSS_PATH[i];

      console.log(`File added to bundle. File: "${CSS_PATH}"`);
      const TEXT = await this.getFileContentByPath(CSS_PATH);
      WRITE_STREAM.write(TEXT);
    }

    WRITE_STREAM.end();
    await FINISH_WRITE_STREAM_PROMISE;
    console.log(`} Bundle created ${BUNDLE_FILE_PATH}`);
  }
}

async function main() {
  try {
    const BUNDLE_FILE_PATH = path.join(__dirname, './project-dist/bundle.css');
    const CSS_FOLDER_PATH = path.join(__dirname, './styles');
    Task05Helper.createBundleCss(BUNDLE_FILE_PATH, CSS_FOLDER_PATH);
  } catch (exception) {
    console.error(exception);
  }
}

if (require.main === module) {
  main();
}

module.exports = { Task05Helper };
