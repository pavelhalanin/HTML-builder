const fs = require('fs');
const path = require('path');

class Task04Helper {
  static async copyDirectory(copy_from, copy_to) {
    console.log(
      [
        `Copy directory and files on directory:`,
        `- from : ${copy_from}`,
        `- to   : ${copy_to}`,
      ].join('\n'),
    );

    await this.recursiveRemove(copy_to);
    await this.createDirectory(copy_to);

    const ARRAY = await this.getFolderInner(copy_from);

    for (const FILE_OR_FOLDER of ARRAY) {
      const PATH_FROM = path.join(copy_from, FILE_OR_FOLDER.name);
      const PATH_TO = path.join(copy_to, FILE_OR_FOLDER.name);

      const IS_DIRECTORY = FILE_OR_FOLDER.isDirectory();

      if (IS_DIRECTORY) {
        await this.copyDirectory(PATH_FROM, PATH_TO);
        continue;
      }

      await fs.promises.copyFile(PATH_FROM, PATH_TO);
    }
  }

  static async getFolderInner(folderPath) {
    return await fs.promises.readdir(folderPath, { withFileTypes: true });
  }

  static async createDirectory(folderPath) {
    await fs.promises.mkdir(folderPath, { recursive: true });
  }

  static async recursiveRemove(folderPath) {
    await fs.promises.rm(folderPath, {
      recursive: true,
      force: true,
    });
  }
}

async function main() {
  try {
    const PATH_FROM = path.join(__dirname, './files');
    const PATH_TO = path.join(__dirname, './files-copy');
    await Task04Helper.copyDirectory(PATH_FROM, PATH_TO);
  } catch (exception) {
    console.error(exception);
  }
}

if (require.main === module) {
  main();
}

module.exports = { Task04Helper };
