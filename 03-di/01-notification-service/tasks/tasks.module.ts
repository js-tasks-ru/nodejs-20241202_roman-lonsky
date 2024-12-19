import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { UsersModule } from "../users/users.module";
import { NotificationService } from "../providers/NotificationService";
import { FileLoggerService, ConsoleLoggerService } from '../providers/Logger';
import {LoggerService} from "../tokens";

const getLogger = () => process.env.LOGGER === 'file' ? new FileLoggerService(Date.now().toString(), 'logs.txt') : new ConsoleLoggerService();

@Module({
  imports: [UsersModule],
  controllers: [TasksController],
  providers: [TasksService, NotificationService, { provide:  LoggerService, useFactory: () => getLogger()}],
})
export class TasksModule {}
