const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;

class Task02Helper {
  static logWelcomeMessage(filePath) {
    console.log(`Enter text to save to file"${filePath}"\n`);
    console.log('To finish:');
    console.log('1) Press Enter, type "exit", press Enter');
    console.log('2) Or press Ctrl + C \n');
    console.log('Text:');
  }

  static startWriteToFileByPath(filePath) {
    const OUTPUT = fs.createWriteStream(filePath, { flags: 'a' });

    stdin.on('data', (data) => {
      const INPUT = data.toString();
      const TRIMMED_INPUT = INPUT.trim();
      const IS_EXIT_COMMAND = TRIMMED_INPUT == 'exit';

      if (IS_EXIT_COMMAND) {
        console.log('Application finished by "exit" command');
        process.exit();
        return;
      }

      OUTPUT.write(INPUT);
    });

    process.on('SIGINT', () => {
      console.log('Application finished by SIGINT signal');
      process.exit();
    });

    OUTPUT.on('error', (err) => {
      console.log(`Error writing to file: ${err.message}`);
      process.exit(1);
    });

    process.on('exit', () => {
      console.log(`Application destructor started`);
      OUTPUT.end();
      console.log(`Application destructor finished`);
    });
  }
}

function main() {
  try {
    const FILE_PATH = path.join(__dirname, 'output.txt');

    Task02Helper.logWelcomeMessage(FILE_PATH);
    Task02Helper.startWriteToFileByPath(FILE_PATH);
  } catch (exception) {
    console.error(exception);
  }
}

main();
