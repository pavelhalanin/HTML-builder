const fs = require('fs');
const path = require('path');
const { Task04Helper } = require('./../04-copy-directory');
const { Task05Helper } = require('./../05-merge-styles');

class Task06Helper {
  static logScore() {
    console.log(
      [
        '\n< < < < < < < <',
        'Task 06 Build Page [135 / 135]',
        'EN',
        "- [x] 20 / 20 After running 'node 06-build-page', the project-dist folder is created and contains index.html, style.css, and an `assets/` folder",
        '- [x] 35 / 35 index.html is built by substituting every {{component-name}} tag in template.html with the contents of `components/<component-name>.html`',
        "- [x] 20 / 20 `style.css` is a bundle of all `.css` files from the '`styles`' folder",
        '- [x] 20 / 20 `assets/` is an exact copy of `06-build-page/assets/`',
        '- [x] 10 / 10 The original `template.html` is not modified by the script',
        "- [x] 10 / 10 Two template tags written on the same line separated only by spaces (e.g. '`{{about}} {{articles}}`') are processed as separate components without errors",
        '- [x] 20 / 20 Rerunning the script after a new component is added to `components/` and its tag is added to template.html correctly updates `project-dist/index.html`. Changes inside `styles/` and `assets/` are also picked up',
        'RU:',
        "- [x] 20 / 20 После запуска 'node 06-build-page' создаётся папка project-dist, содержащая index.html, style.css и папку `assets/`",
        '- [x] 35 / 35 index.html собирается путём замены каждого тега {{имя-компонента}} в template.html на содержимое `components/<имя-компонента>.html`',
        "- [x] 20 / 20 `style.css` является бандлом всех файлов `.css` из папки '`styles`'",
        '- [x] 20 / 20 `assets/` является точной копией `06-build-page/assets/`',
        '- [x] 10 / 10 Исходный `template.html` не изменяется скриптом',
        "- [x] 10 / 10 Два тега шаблона, записанных в одной строке с пробелами между ними (например, '`{{about}} {{articles}}`'), обрабатываются как отдельные компоненты без ошибок",
        '- [x] 20 / 20 Повторный запуск скрипта после добавления нового компонента в `components/` и добавления его тега в template.html корректно обновляет `project-dist/index.html`. Изменения внутри `styles/` и `assets/` также учитываются',
        '> > > > > > > >\n',
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

  static extractTemplates(text) {
    const REGEX = /\{\{\s*([^}]+?)\s*\}\}/g;

    const COMPONENTS = [];

    let match;
    while ((match = REGEX.exec(text)) !== null) {
      COMPONENTS.push(match[1].trim());
    }

    const DICT = {};
    for (let i = 0; i < COMPONENTS.length; i++) {
      DICT[COMPONENTS[i]] = '';
    }

    return DICT;
  }

  static async createFolderIfNotExists(folderPath) {
    await fs.promises.mkdir(folderPath, { recursive: true });
  }

  static async createTemplate(templatePath, buildTempatePath, componentsPath) {
    const TEMPLATE_CONTENT =
      await Task06Helper.getFileContentByPath(templatePath);
    let text = `${TEMPLATE_CONTENT}`;

    const COMPONENTS_DICT = Task06Helper.extractTemplates(TEMPLATE_CONTENT);
    const COMPONENTS = Object.keys(COMPONENTS_DICT);
    for (let i = 0; i < COMPONENTS.length; i++) {
      const COMPONENT = COMPONENTS[i];
      const COMPONENT_PATH = path.join(componentsPath, `./${COMPONENT}.html`);
      const COMPONENT_TEXT =
        await Task06Helper.getFileContentByPath(COMPONENT_PATH);
      text = text.replaceAll(`{{${COMPONENT}}}`, COMPONENT_TEXT);
    }

    await Task06Helper.createFolderIfNotExists(buildTempatePath);
    const indexPath = path.join(buildTempatePath, 'index.html');

    const writeStream = fs.createWriteStream(indexPath, 'utf-8');

    writeStream.on('error', (err) => {
      console.error(`Error writing to ${indexPath}: ${err.message}`);
    });

    const finishWriteStreamPromise = new Promise((resolve) => {
      writeStream.on('finish', resolve);
    });

    writeStream.write(text);

    writeStream.end();

    await finishWriteStreamPromise;

    console.log(`${indexPath} successfuly created`);
  }
}

async function main() {
  try {
    Task06Helper.logScore();

    // Assets path:
    const DEVELOP_ASSETS_PATH = path.join(__dirname, './assets');
    const RELEASE_ASSETS_PATH = path.join(__dirname, './project-dist/assets/');

    // Templates path:
    const DEVELOP_TEMPLATE_PATH = path.join(__dirname, './template.html');
    const RELEASE_TEMPLATE_FOLDER_PATH = path.join(__dirname, './project-dist');
    const DEVELOP_COMPONENTS_PATH = path.join(__dirname, './components');

    // CSS path:
    const DEVELOP_CSS_FOLDER_PATH = path.join(__dirname, './styles');
    const RELEASE_CSS_BUNDLE_FILE = path.join(
      __dirname,
      './project-dist/styles.css',
    );

    await Task04Helper.recursiveRemove(RELEASE_ASSETS_PATH);
    await Task04Helper.copyDirectory(DEVELOP_ASSETS_PATH, RELEASE_ASSETS_PATH);

    await Task05Helper.bundle(RELEASE_CSS_BUNDLE_FILE, DEVELOP_CSS_FOLDER_PATH);

    await Task06Helper.createTemplate(
      DEVELOP_TEMPLATE_PATH,
      RELEASE_TEMPLATE_FOLDER_PATH,
      DEVELOP_COMPONENTS_PATH,
    );
  } catch (exception) {
    console.error(exception);
  }
}

main();
