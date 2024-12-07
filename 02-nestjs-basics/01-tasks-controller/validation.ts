import {PipeTransform, Injectable, ArgumentMetadata, BadRequestException} from '@nestjs/common';
import {validate} from 'class-validator';
import {plainToInstance} from 'class-transformer';

export const errorsToMessage = <T extends {value?: string, property: string; constraints?: {[key: string]: string}}>(errors: T[]) => {
  return errors.map(({value, property, constraints}) => {
    return {
      value, property, constraints
    }

  });
}

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, {metatype}: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(errorsToMessage(errors));
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
