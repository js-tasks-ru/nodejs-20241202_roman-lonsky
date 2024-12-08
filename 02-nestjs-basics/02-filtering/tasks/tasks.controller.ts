import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import {TasksService} from "./tasks.service";
import {TaskStatus} from "./task.model";
import {ValidationSortByQueryPipe, ValidationStatusQueryPipe} from "../validation";
import {SortBy} from "./task.types";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query("status", new ValidationStatusQueryPipe(TaskStatus, { optional: true } )) status: TaskStatus,
    @Query("page", new ParseIntPipe({optional: true})) page: number,
    @Query("limit", new ParseIntPipe({optional: true})) limit: number,
    @Query("sortBy", new ValidationSortByQueryPipe(SortBy, { optional: true } )) sortBy: SortBy,
  ) {
    return this.tasksService.getFilteredTasks(status, page, limit, sortBy);
  }
}
