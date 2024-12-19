import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { UsersModule } from "../users/users.module";
import { NotificationService } from "../providers/NotificationService";
import { FileLoggerService, ConsoleLoggerService } from '../providers/Logger';

const logger = process.env.LOGGER === 'file' ? new FileLoggerService(Date.now().toString(), 'logs.txt') : new ConsoleLoggerService();

@Module({
  imports: [UsersModule],
  controllers: [TasksController],
  providers: [TasksService, { provide: NotificationService, useFactory: () =>  new NotificationService(logger) }],
})
export class TasksModule {}
