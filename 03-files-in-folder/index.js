const { promises: fsPromises } = require('fs');
const path = require('path');

class Task03Helper {
  static async printDirectoryInfoByPath(folderPath) {
    const STATS = await fsPromises.stat(folderPath);

    const IS_NOT_DIRECTORY = !STATS.isDirectory();
    if (IS_NOT_DIRECTORY) {
      console.log(`It is not a directory: ${folderPath}`);
      return;
    }

    const DATA_ARRAY = await this.getFolderItemsDataByPath(folderPath);

    if (DATA_ARRAY.length == 0) {
      console.log(`Folder is empty: ${folderPath}`);
      return;
    }

    console.log(`About files in folder '${folderPath}':`);
    this.printFolderItemsDataAsHyphenatedStringByArray(DATA_ARRAY);
  }

  static async getFolderItemsDataByPath(FOLDER_PATH) {
    const files = await fsPromises.readdir(FOLDER_PATH, {
      withFileTypes: true,
    });

    const DATA_ARRAY = [];
    for (const file of files) {
      if (file.isFile()) {
        const FILE_PATH = path.join(FOLDER_PATH, file.name);
        const STATS = await fsPromises.stat(FILE_PATH);
        const BYTES = STATS.size;
        const KILO_BYTES = BYTES / 1024;

        DATA_ARRAY.push({
          ext: path.extname(file.name).slice(1),
          kbNoRounded: KILO_BYTES,
          name: path.parse(file.name).name,
        });
      }
    }

    return DATA_ARRAY;
  }

  static printFolderItemsDataAsHyphenatedStringByArray(DATA_ARRAY) {
    for (let i = 0; i < DATA_ARRAY.length; i++) {
      const CURRENT = DATA_ARRAY[i];
      const VALUE = [
        CURRENT.name,
        CURRENT.ext,
        `${CURRENT.kbNoRounded}kb`,
      ].join(' - ');
      console.log(VALUE);
    }
  }
}

async function main() {
  try {
    const FOLDER_PATH = path.join(__dirname, 'secret-folder');
    Task03Helper.printDirectoryInfoByPath(FOLDER_PATH);
  } catch (exception) {
    console.error(exception);
  }
}

main();
