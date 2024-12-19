import {ILogger} from './types';
import * as fs from 'node:fs';
import * as path from 'node:path';

export class FileLoggerService implements ILogger {
  constructor(private path: string, private fileName: string) {
    try {
      fs.mkdirSync(path);
    } catch (error) {
      console.error(error);
    }
  };

  log(message: string) {
    try {
      fs.appendFileSync(path.join(this.path, this.fileName), `[${new Date().toTimeString()}]: ${message}\n`);
    } catch (error) {
      console.error(error);
    }
  }
}

export class ConsoleLoggerService implements ILogger {
  log(message: string) {
    console.log(`[${new Date().toTimeString()}]: ${message}`);
  }
}
