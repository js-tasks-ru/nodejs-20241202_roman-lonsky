import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  // Res,
  // Req,
  // Next
  // ParseUUIDPipe
  ParseIntPipe,
} from "@nestjs/common";
import {TasksService} from "./tasks.service";
import {TaskDto, TaskStatus} from "./task.model";
import {hasFilter} from "../helpers";
import {ValidationPipe, ValidationSortByQueryPipe, ValidationStatusQueryPipe} from "../validation";
import {SortBy} from "./task.types";
// import {Request, Response} from 'express';

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAllTasks(
    @Query("status", new ValidationStatusQueryPipe(TaskStatus, { optional: true } )) status: TaskStatus,
    @Query("page", new ParseIntPipe({optional: true})) page: number,
    @Query("limit", new ParseIntPipe({optional: true})) limit: number,
    @Query("sortBy", new ValidationSortByQueryPipe(SortBy, { optional: true } )) sortBy: SortBy,
  ) {
    if (hasFilter([status, page, sortBy])) {
      return this.tasksService.getTasks({status, paging: {page, limit}, sortBy});
    }

    return this.tasksService.getAllTasks();
  }

  @Get(":id")
  getTaskById(@Param("id") id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body(new ValidationPipe()) task: TaskDto) {
    return this.tasksService.createTask(task);
  }

  @Patch(":id")
  updateTask(@Param("id") id: string, @Body(new ValidationPipe()) task: TaskDto) {
    return this.tasksService.updateTask(id, task);
  }

  @Delete(":id")
  deleteTask(@Param("id") id: string) {
    return this.tasksService.deleteTask(id);
  }
}
