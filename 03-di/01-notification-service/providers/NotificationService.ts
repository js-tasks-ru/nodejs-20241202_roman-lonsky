import { Injectable, Inject } from "@nestjs/common";
import { LoggerService } from '../tokens';
import { ILogger } from './types';
import {ConfigurationService} from "../configuration/configuration.service";

@Injectable()
export class NotificationService {
  constructor(@Inject(LoggerService) private logger: ILogger, private configurationService: ConfigurationService) {
    console.log('NotificationService', this.configurationService.options);
  };
  
  sendEmail(to: string, subject: string, message: string): void {
    const mess = `Email sent to ${to}: [${subject}] ${message}`;

    console.log(mess);

    this.logger.log(mess);
  }

  sendSMS(to: string, message: string): void {
    const mess = `SMS sent to ${to}: ${message}`;

    console.log(mess);

    this.logger.log(mess);
  }
}
