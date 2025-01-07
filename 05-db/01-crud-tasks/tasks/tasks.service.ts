import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateTaskDto} from "./dto/create-task.dto";
import {UpdateTaskDto} from "./dto/update-task.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Task} from "./entities/task.entity";
import {SortBy, SortDir} from "./types";

const ZERO_OFFSET = 1;

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    return await this.taskRepository.save(createTaskDto);
  }

  async findAll(options: {page?: number; limit?: number; sortBy?: SortBy, sortDir?: SortDir, queryIn?: string}) {
    if (!Object.values(options).some(value => value !== undefined)) {
      return await this.taskRepository.find();
    }

    const {page = 1, limit = 5, sortBy = 'title', sortDir = 'ASC', queryIn = ''} = options;

    const qSelect = 'SELECT * FROM task';
    const wereLike = (queryIn: string) => `WHERE (description LIKE '%${queryIn}%' OR  title LIKE '%${queryIn}%')`;
    const orderBy = `ORDER BY ${sortBy} ${sortDir}`;
    const limitBy = `LIMIT ${limit} OFFSET ${(page - ZERO_OFFSET) * limit}`;


    const query = [];

    query.push(qSelect);

    if (queryIn !== '') {
      query.push(wereLike(queryIn))
    }

    query.push(orderBy)

    query.push(limitBy)

    return await this.taskRepository.query(query.join('\n'));
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({where: {id}});

    if (task) {
      return task;
    }

    throw new NotFoundException(`Task with id ${id} not found`);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);

    if (task) {
      await this.taskRepository.update(id, updateTaskDto);
      return await this.findOne(id);
    }

    throw new NotFoundException(`Task with id ${id} not found`);
  }

  async remove(id: number): Promise<{message: string}> {
    const task = await this.findOne(id);

    if (task) {
      await this.taskRepository.delete(id);

      return {
        message: "Task deleted successfully"
      };
    }

    throw new NotFoundException(`Task with id ${id} not found`);
  }
}
