const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;

class Task02Helper {
  static logScore() {
    console.log(
      [
        `\n< < < < < < < <`,
        `Task 02 Write File [50 / 50]`,
        'EN',
        `- [x] 10 / 10 Running 'node 02-write-file' creates a file inside 02-write-file/ and prints a prompt`,
        `- [x] 15 / 15 Each line entered by the user is appended to that file (previous content is preserved)`,
        `- [x] 5 / 5 The process keeps waiting for further input after each write`,
        `- [x] 10 / 10 Typing 'exit' prints a farewell message and terminates the process`,
        `- [x] 10 / 10 Pressing Ctrl + C prints a farewell message and terminates the process`,
        `RU:`,
        `- [x] 10 / 10 Запуск 'node 02-write-file' создаёт файл внутри 02-write-file/ и выводит приглашение`,
        `- [x] 15 / 15 Каждая строка, введённая пользователем, добавляется в этот файл (предыдущее содержимое сохраняется)`,
        `- [x] 5 / 5 Процесс продолжает ожидать следующий ввод после каждой записи`,
        `- [x] 10 / 10 Ввод 'exit' выводит прощальное сообщение и завершает процесс`,
        `- [x] 10 / 10 Нажатие Ctrl + C выводит прощальное сообщение и завершает процесс`,
        `> > > > > > > >\n`,
      ].join('\n'),
    );
  }

  static getDateTimePrefix() {
    const DATETIME = new Date().toJSON().slice(0, 19).replace('T', ' ');
    return `[${DATETIME}] `;
  }

  static log(text) {
    const DATE_TIME = this.getDateTimePrefix();
    stdout.write(`${DATE_TIME}${text}\n`);
  }

  static logWelcomeMessage() {
    this.log('Enter text to save to output.txt \n');
    this.log('To finish:');
    this.log('1) Press Enter, type "exit", press Enter');
    this.log('2) Or press Ctrl + C \n');
    this.log('Text:');
  }

  static startWriteToFileByPath(filePath) {
    const OUTPUT = fs.createWriteStream(filePath);

    stdin.on('data', (data) => {
      const INPUT = data.toString();
      const TRIMMED_INPUT = INPUT.trim();
      const IS_EXIT_COMMAND = TRIMMED_INPUT == 'exit';

      if (IS_EXIT_COMMAND) {
        this.log('Application finished by "exit" command');
        process.exit();
        return;
      }

      OUTPUT.write(INPUT);
    });

    process.on('SIGINT', () => {
      this.log('Application finished by SIGINT signal');
      process.exit();
    });

    OUTPUT.on('error', (err) => {
      this.log(`Error writing to file: ${err.message}`);
      process.exit(1);
    });

    process.on('exit', () => {
      this.log(`Application destructor started`);
      OUTPUT.end();
      this.log(`Application destructor finished`);
    });
  }
}

function main() {
  try {
    const FILE_PATH = path.join(__dirname, 'output.txt');

    Task02Helper.logScore();
    Task02Helper.logWelcomeMessage();
    Task02Helper.startWriteToFileByPath(FILE_PATH);
  } catch (exception) {
    console.error(exception);
  }
}

main();
