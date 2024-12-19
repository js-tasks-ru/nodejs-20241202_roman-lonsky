import { BadRequestException, Injectable, NotFoundException, Inject } from "@nestjs/common";
import { CreateTaskDto, Task, TaskStatus, UpdateTaskDto } from "./task.model";
import { UsersService } from '../users/users.service';
import { NotificationService } from '../providers/NotificationService';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  constructor(
    private usersService: UsersService, 
    private notificationService: NotificationService
  ) {};

  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description, assignedTo } = createTaskDto;
    const task: Task = {
      id: (this.tasks.length + 1).toString(),
      title,
      description,
      status: TaskStatus.Pending,
      assignedTo,
    };

    this.tasks.push(task);

    const user = this.usersService.getUserById(assignedTo);

    if (!user) {
      throw new NotFoundException('404 Not Found');
    }

    if (!user.email) {
      throw new BadRequestException('400 Bad Request');
    }

    const message = `Вы назначены ответственным за задачу: "${title}"`;

    this.notificationService.sendEmail(user.email, 'Новая задача', message);

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = this.tasks.find((t) => t.id === id);

    if (!task) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }

    Object.assign(task, updateTaskDto);

    const user = this.usersService.getUserById(task.assignedTo);

    if (!user) {
      throw new NotFoundException('404 Not Found');
    }

    if (!user.phone) {
      throw new BadRequestException('400 Bad Request');
    }

    const message = `Статус задачи "${task.title}" обновлён на "${task.status}"`;

    this.notificationService.sendSMS(user.phone, message);

    return task;
  }
}
