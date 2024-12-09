export class Logger {
  constructor(private name: string) {}

  log(...args: any[]) {
    console.log(`[${this.name}: ${new Date().toLocaleTimeString()}]: `, ...args,);
  }
}
