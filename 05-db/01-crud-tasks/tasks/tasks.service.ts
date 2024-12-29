import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateTaskDto} from "./dto/create-task.dto";
import {UpdateTaskDto} from "./dto/update-task.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Task} from "./entities/task.entity";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    return await this.taskRepository.save(createTaskDto);
  }

  async findAll() {
    return await this.taskRepository.find();
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

  async remove(id: number): Promise<{ message: string }> {
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
