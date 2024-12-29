import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import {ValidationPipe} from "../validation";
import {CreateTaskDto} from "./dto/create-task.dto";
import {UpdateTaskDto} from "./dto/update-task.dto";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body(new ValidationPipe()) task: CreateTaskDto) {
    return this.tasksService.create(task);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(":id")
  findOne(@Param('id', new ParseIntPipe()) id: number) {
   return this.tasksService.findOne(id);
  }

  @Patch(":id")
  update(@Param('id', new ParseIntPipe()) id: number, @Body(new ValidationPipe()) task: UpdateTaskDto) {
    return this.tasksService.update(id, task);
  }

  @Delete(":id")
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.tasksService.remove(id);
  }
}
