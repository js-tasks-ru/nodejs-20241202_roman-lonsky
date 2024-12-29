import {Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query} from "@nestjs/common";
import {TasksService} from "./tasks.service";
import {ValidationPipe, ValidationSortByQueryPipe} from "../validation";
import {CreateTaskDto} from "./dto/create-task.dto";
import {UpdateTaskDto} from "./dto/update-task.dto";
import {SortBy, SortDir} from "./types";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body(new ValidationPipe()) task: CreateTaskDto) {
    return this.tasksService.create(task);
  }

  @Get()
  findAll(
    @Query("page", new ParseIntPipe({optional: true})) page: number,
    @Query("limit", new ParseIntPipe({optional: true})) limit: number,
    @Query("sortBy", new ValidationSortByQueryPipe(SortBy, {optional: true})) sortBy: SortBy,
    @Query("sortDir", new ValidationSortByQueryPipe(SortDir, {optional: true})) sortDir: SortDir,
    @Query("queryIn") queryIn: string,
  ) {
    return this.tasksService.findAll({
      limit,
      page,
      sortBy,
      sortDir,
      queryIn
    });
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
