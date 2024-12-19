import { ILogger } from './types';

export class NotificationService {
  constructor(private logger?: ILogger) {
    console.log('NotificationService', logger);
  };
  
  sendEmail(to: string, subject: string, message: string): void {
    const mess = `Email sent to ${to}: [${subject}] ${message}`;

    console.log(mess);

    this.logger?.log(mess);
  }

  sendSMS(to: string, message: string): void {
    const mess = `SMS sent to ${to}: ${message}`;

    console.log(mess);

    this.logger?.log(mess);
  }
}
