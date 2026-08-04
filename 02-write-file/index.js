const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;

function getDateTimePrefix() {
  const DATETIME = new Date().toJSON().slice(0, 19).replace('T', ' ');
  return `[${DATETIME}]`;
}

function log(text) {
  stdout.write(`${getDateTimePrefix()} ${text}\n`);
}

function welcomeMessage() {
  log('Enter text to save to output.txt \n');
  log('To finish:');
  log('1) Press Enter, type "exit", press Enter');
  log('2) Or press Ctrl + C \n');
  log('Text:');
}

function main() {
  const FILE_PATH = path.join(__dirname, 'output.txt');
  const OUTPUT = fs.createWriteStream(FILE_PATH);

  welcomeMessage();

  stdin.on('data', (data) => {
    const INPUT = data.toString();
    const TRIMMED_INPUT = INPUT.trim();
    const IS_EXIT_COMMAND = TRIMMED_INPUT == 'exit';

    if (IS_EXIT_COMMAND) {
      log('Application finished by "exit" command');
      process.exit();
      return;
    }

    OUTPUT.write(INPUT);
  });

  process.on('SIGINT', () => {
    log('Application finished by SIGINT signal');
    process.exit();
  });

  OUTPUT.on('error', (err) => {
    log(`Error writing to file: ${err.message}`);
    process.exit(1);
  });

  process.on('exit', () => {
    log(`Application destructor started`);
    OUTPUT.end();
    log(`Application destructor finished`);
  });
}

main();
