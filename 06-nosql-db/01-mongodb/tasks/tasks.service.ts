import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateTaskDto} from "./dto/create-task.dto";
import {UpdateTaskDto} from "./dto/update-task.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Task} from "./schemas/task.schema";
import {Model, ObjectId} from "mongoose";

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const createdTask = new this.taskModel(createTaskDto);
      return createdTask.save();
    } catch (error) {
      // Обработка ошибок, например, уникальности
      throw error;
    }
  }

  async findAll() {
    return this.taskModel.find().exec();
  }

  async findOne(id: ObjectId) {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException("Task not found");
    return task;
  }

  async update(id: ObjectId, updateTaskDto: UpdateTaskDto) {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, {new: true})
      .exec();
    if (!updatedTask) throw new NotFoundException("Task not found");
    return updatedTask;
  }

  async remove(id: ObjectId) {
    const deletedTask = await this.taskModel.findByIdAndDelete(id).exec();
    if (!deletedTask) throw new NotFoundException("Task not found");
    return deletedTask;
  }
}
