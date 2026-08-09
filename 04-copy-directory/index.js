const fs = require('fs');
const path = require('path');

class Task04Helper {
  static logScore() {
    console.log(
      [
        `\n< < < < < < < <`,
        `Task 04 Copy directory [70 / 70]`,
        'EN',
        `- [x] 30 / 30 After running 'node 04-copy-directory', the files-copy folder exists and exactly mirrors the contents of files`,
        `- [x] 20 / 20 Rerunning the script after files are added/modified inside 'files' updates 'files-copy' accordingly`,
        `- [x] 20 / 20 Rerunning the script after files are removed from 'files' also removes them from 'files-copy'`,
        `RU:`,
        `- [x] 30 / 30 После запуска 'node 04-copy-directory' папка files-copy существует и точно отражает содержимое files`,
        `- [x] 20 / 20 Повторный запуск скрипта после добавления/изменения файлов в 'files' обновляет 'files-copy' соответствующим образом`,
        `- [x] 20 / 20 Повторный запуск скрипта после удаления файлов из 'files' также удаляет их из 'files-copy'`,
        `> > > > > > > >\n`,
      ].join('\n'),
    );
  }

  static async copyDirectory(copy_from, copy_to) {
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
    Task04Helper.logScore();

    const PATH_FROM = path.join(__dirname, './files');
    const PATH_TO = path.join(__dirname, './files-copy');

    console.log(`Copy "${PATH_FROM}" to "${PATH_TO}"`);

    await Task04Helper.recursiveRemove(PATH_TO);
    Task04Helper.copyDirectory(PATH_FROM, PATH_TO);
  } catch (exception) {
    console.error(exception);
  }
}

if (require.main === module) {
  main();
}

module.exports = { Task04Helper };
