import {Injectable, NotFoundException} from "@nestjs/common";
import {Task} from "./task.model";
import {Logger} from '../logger';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private logger = new Logger('TasksService');

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    this.log('get task by id ' + typeof id);

    const task = this.tasks.find(task => task.id === id);

    if (!task) {
      this.log('get task by id, no found ' + id);

      throw new NotFoundException(`Task with id ${id} not found`);
    }

    this.log('get task by id, found task ' + task);

    return task;
  }

  createTask(task: Task): Task {
    const newTask = new Task(task);

    this.log('create task ', newTask);

    this.tasks.push(newTask);

    this.log('task created ', newTask.id);

    return newTask;
  }

  updateTask(id: string, update: Task): Task {
    const index = this.tasks.findIndex(task => task.id === id);

    this.log('update task by id ', id);

    if (index === -1) {
      this.log('update task, no task found by id ', id);

      throw new NotFoundException(`Task with id ${id} not found`);
    }

    const currentTask = this.tasks[index];

    this.log('update task, current task ', currentTask);

    const {id: removeId, ...updateBody} = update;

    const updatedTask = {...currentTask, ...updateBody};

    this.log('update task, update task ', updatedTask);

    this.tasks[index] = updatedTask;

    this.log('update task, task updated ', updatedTask.id);

    return updatedTask;
  }

  deleteTask(id: string): Task {
    const task = this.tasks.find(task => task.id === id);

    if (!task) {
      this.log('delete task, no task found by id ', id);

      throw new NotFoundException(`Task with id ${id} not found`);
    }

    this.log('delete task ', task);

    this.tasks = this.tasks.filter(task => task.id !== id);

    this.log('task deleted ', task.id);

    return task;
  }

  private log(...args: any[]) {
    this.logger.log(...args);
  }

}
