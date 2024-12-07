import {Validate, IsString, IsNotEmpty} from 'class-validator';
import {genId} from '../genId';
import {ITask, TaskStatus} from './task.types';
import {TaskStatusCheck} from './task.validation';

export { TaskStatus };

export class TaskDto implements ITask {
  id?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Validate(TaskStatusCheck)
  status: TaskStatus;
}

export class Task extends TaskDto {
  constructor(task: Omit<ITask, 'id'>) {
    super();

    Object.assign(this, task);

    this.id = genId();
  }
}
