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

export abstract class TaskComparator {
  constructor(protected task: ITask) {}

  abstract compare(task: ITask): number;
}

export class CompareByStatus extends TaskComparator {
  constructor(protected task: ITask) {
    super(task);
  }

  compare(task:ITask) {
    return this.task.status.localeCompare(task.status);
  }
}

export class CompareByTitle extends TaskComparator {
  constructor(protected task: ITask) {
    super(task);
  }

  compare(task:ITask) {
    return this.task.title.localeCompare(task.title);
  }
}
