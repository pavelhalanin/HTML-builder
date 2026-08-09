const fs = require('fs/promises');
const path = require('path');

class Task03Helper {
  static logScore() {
    console.log(
      [
        `\n< < < < < < < <`,
        `Task 03 Files in folder [50 / 50]`,
        'EN',
        `- [x] 15 / 15 Running 'node 03-files-in-folder' lists files from 03-files-in-folder/secret-folder to the console`,
        `- [x] 20 / 20 Each line is formatted as '<file name> - <extension> - <size>'`,
        `- [x] 15 / 15 Subdirectories are not listed; only files directly inside secret-folder appear`,
        `RU:`,
        `- [x] 15 / 15 Запуск 'node 03-files-in-folder' выводит список файлов из 03-files-in-folder/secret-folder в консоль`,
        `- [x] 20 / 20 Каждая строка отформатирована как '<имя файла> - <расширение> - <размер>'`,
        `- [x] 15 / 15 Подпапки не перечисляются; отображаются только файлы, находящиеся непосредственно внутри secret-folder`,
        `> > > > > > > >\n`,
      ].join('\n'),
    );
  }

  static async getFolderItemsDataByPath(FOLDER_PATH) {
    const files = await fs.readdir(FOLDER_PATH, { withFileTypes: true });

    const DATA_ARRAY = [];
    for (const file of files) {
      if (file.isFile()) {
        const FILE_PATH = path.join(FOLDER_PATH, file.name);
        const STATS = await fs.stat(FILE_PATH);
        const BYTES = STATS.size;
        const KILO_BYTES = BYTES / 1024;

        DATA_ARRAY.push({
          ext: path.extname(file.name).slice(1),
          kbNoFormatted: KILO_BYTES,
          kb: Number(KILO_BYTES).toFixed(10),
          name: path.parse(file.name).name,
          lastOpenAt: new Date(STATS.atimeMs).toLocaleString(),
          createAt: new Date(STATS.birthtimeMs).toLocaleString(),
        });
      }
    }

    return DATA_ARRAY;
  }

  static printFolderItemsDataAsBeautifulTableByArray(DATA_ARRAY) {
    const TITLE = {
      name: 'File',
      ext: 'Extension',
      kb: 'Size (KB)',
      lastOpenAt: 'Last open',
      createAt: 'Created',
    };

    const KEYS = Object.keys(TITLE);

    const SIZE = {};
    KEYS.forEach((key) => {
      SIZE[key] = TITLE[key].length;
    });

    for (let i = 0; i < DATA_ARRAY.length; i++) {
      const CURRENT = DATA_ARRAY[i];

      KEYS.forEach((key) => {
        const length = String(CURRENT[key]).length;
        if (length > SIZE[key]) {
          SIZE[key] = length;
        }
      });
    }

    if (DATA_ARRAY.length == 0) {
      return;
    }

    console.log(`< < < < < < < < (Beautiful table)\n`);

    console.log(
      KEYS.map((key) => {
        return `${TITLE[key]}`.padStart(SIZE[key], ' ');
      }).join(' | '),
    );

    console.log(
      KEYS.map((key) => {
        return `-`.repeat(SIZE[key]);
      }).join(' | '),
    );

    for (let i = 0; i < DATA_ARRAY.length; i++) {
      const CURRENT = DATA_ARRAY[i];

      console.log(
        KEYS.map((key) => {
          return `${CURRENT[key]}`.padStart(SIZE[key], ' ');
        }).join(' | '),
      );
    }

    console.log('\n> > > > > > > > (End Beautiful table)');
  }

  static printFolderItemsDataAsHyphenatedStringByArray(DATA_ARRAY) {
    console.log(
      '< < < < < < < < [ {fileName} - {fileExtension} - {fileSize}kb ]\n',
    );

    for (let i = 0; i < DATA_ARRAY.length; i++) {
      const CURRENT = DATA_ARRAY[i];

      console.log(
        [CURRENT.name, CURRENT.ext, `${CURRENT.kbNoFormatted}kb`].join(' - '),
      );
    }

    console.log(
      '\n> > > > > > > > [ {fileName} - {fileExtension} - {fileSize}kb ]',
    );
  }
}

async function main() {
  try {
    Task03Helper.logScore();

    const FOLDER_PATH = path.join(__dirname, 'secret-folder');
    const DATA_ARRAY = await Task03Helper.getFolderItemsDataByPath(FOLDER_PATH);

    if (DATA_ARRAY.length == 0) {
      console.log(`Folder is empty: ${FOLDER_PATH}\n`);
      return;
    }

    console.log(`About files in folder '${FOLDER_PATH}':\n`);

    Task03Helper.printFolderItemsDataAsBeautifulTableByArray(DATA_ARRAY);
    console.log('\n');
    Task03Helper.printFolderItemsDataAsHyphenatedStringByArray(DATA_ARRAY);
  } catch (error) {
    console.error(error);
    console.error(error.message);
  }
}

main();
