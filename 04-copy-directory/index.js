const fs = require('fs');
const path = require('path');

async function copyDirectory(copy_from, copy_to) {
  await createDirectory(copy_to);
  const ARRAY = await getFolderInner(copy_from);

  for (const FILE_OR_FOLDER of ARRAY) {
    const PATH_FROM = path.join(copy_from, FILE_OR_FOLDER.name);
    const PATH_TO = path.join(copy_to, FILE_OR_FOLDER.name);

    const IS_DIRECTORY = FILE_OR_FOLDER.isDirectory();

    if (IS_DIRECTORY) {
      await copyDirectory(PATH_FROM, PATH_TO);
      continue;
    }

    await fs.promises.copyFile(PATH_FROM, PATH_TO);
  }
}

async function getFolderInner(folderPath) {
  return await fs.promises.readdir(folderPath, { withFileTypes: true });
}

async function createDirectory(folderPath) {
  await fs.promises.mkdir(folderPath, { recursive: true });
}

async function recursiveRemove(folderPath) {
  await fs.promises.rm(folderPath, {
    recursive: true,
    force: true,
  });
}

async function main() {
  try {
    const PATH_FROM = path.join(__dirname, './files');
    const PATH_TO = path.join(__dirname, './files-copy');
    await recursiveRemove(PATH_TO);
    copyDirectory(PATH_FROM, PATH_TO);
  } catch (exception) {
    console.error(exception);
  }
}

main();
