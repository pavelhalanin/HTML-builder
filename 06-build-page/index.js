const fs = require('fs');
const path = require('path');
const { Task04Helper } = require('./../04-copy-directory');
const { Task05Helper } = require('./../05-merge-styles');

class Task06Helper {
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

    console.log(`Template created: "${indexPath}"`);
  }
}

async function main() {
  try {
    const PATH_DATA = {
      assets: {
        develop: path.join(__dirname, './assets'),
        release: path.join(__dirname, './project-dist/assets/'),
      },
      template: {
        develop: path.join(__dirname, './template.html'),
        release: path.join(__dirname, './project-dist'),
        includes: path.join(__dirname, './components'),
      },
      css: {
        develop: path.join(__dirname, './styles'),
        release: path.join(__dirname, './project-dist/styles.css'),
      },
    };

    console.log('\nCopy assets:\n');

    await Task04Helper.copyDirectory(
      PATH_DATA.assets.develop,
      PATH_DATA.assets.release,
    );

    console.log('\nCreate CSS bundle:\n');

    await Task05Helper.createBundleCss(
      PATH_DATA.css.release,
      PATH_DATA.css.develop,
    );

    console.log('\nCreate template:\n');

    await Task06Helper.createTemplate(
      PATH_DATA.template.develop,
      PATH_DATA.template.release,
      PATH_DATA.template.includes,
    );
  } catch (exception) {
    console.error(exception);
  }
}

main();
