import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import {ConfigurationModule} from "./configuration/configuration.module";
import * as path from 'node:path';

const configFileName = path.join('./', 'config.json');

console.log(configFileName);
console.log(__dirname);

// const configFileName = path.resolve(
//   `${__dirname}`,
//   "./config.json"
// )

@Module({
  imports: [TasksModule, ConfigurationModule.forRoot(configFileName) ],
})
export class AppModule {}
