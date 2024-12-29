import {PipeTransform, Injectable, ArgumentMetadata, BadRequestException} from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import {validate} from 'class-validator';

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
    const errors = await validate(object, { whitelist: true,  forbidNonWhitelisted: true });
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

@Injectable()
export class ValidationSortByQueryPipe<T extends object = any> implements PipeTransform<any> {
  private enumType: T;
  private optional?: boolean;
  private valueChecker?: (value: T) => string | undefined;

  constructor(enumType: T, options: {optional?: boolean, valueChecker?: (value: T) => string | undefined} = {optional: false, valueChecker: () => undefined}) {
    this.enumType = enumType;
    this.optional = options.optional;
    this.valueChecker = options.valueChecker;
  }

  private isValid(value: T) {
    if (this.optional && value === undefined) {
      return true;
    }

    return Object.values(this.enumType).includes(value);
  }

  transform(value: T) {
    const valid = this.isValid(value);

    if (!valid) {
      throw new BadRequestException(`SortBy: ${value} is not valid, sortBy must be in {${Object.values(this.enumType).join(', ')}}`);
    }

    if (this.valueChecker) {
      const error = this.valueChecker(value);

      if (error) {
        throw new BadRequestException(error);
      }
    }

    return value;
  }
}
