import {ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';
import {TaskStatus} from './task.types';

export const availableStatuses = Object.values(TaskStatus);

@ValidatorConstraint({name: 'status', async: false})
export class TaskStatusCheck implements ValidatorConstraintInterface {
  validate(text: TaskStatus,) {
    return availableStatuses.includes(text);
  }

  defaultMessage() {
    return `Task status can only be '${availableStatuses.join(', ')}'!`;
  }
}

