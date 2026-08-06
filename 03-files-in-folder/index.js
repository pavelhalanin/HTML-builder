const fs = require('fs/promises');
const path = require('path');

async function main() {
  const FOLDER_PATH = path.join(__dirname, 'secret-folder');

  try {
    const files = await fs.readdir(FOLDER_PATH, { withFileTypes: true });

    const DATA_ARRAY = [];
    for (const file of files) {
      if (file.isFile()) {
        const FILE_PATH = path.join(FOLDER_PATH, file.name);
        const STATS = await fs.stat(FILE_PATH);

        DATA_ARRAY.push({
          ext: path.extname(file.name).slice(1),
          kb: Number(STATS.size / 1024).toFixed(10),
          name: path.parse(file.name).name,
          lastOpenAt: new Date(STATS.atimeMs).toLocaleString(),
          createAt: new Date(STATS.birthtimeMs).toLocaleString(),
        });
      }
    }

    const TITLE = {
      ext: 'Extension',
      kb: 'Size (KB)',
      name: 'File',
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
      console.log(`\nFolder is empty: ${FOLDER_PATH}\n`);
    }

    if (DATA_ARRAY.length > 0) {
      console.log(`\nAbout files in folder '${FOLDER_PATH}':\n`);

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
    }
  } catch (error) {
    console.error(error);
    console.error(error.message);
  }
}

main();
