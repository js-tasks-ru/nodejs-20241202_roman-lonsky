import { BadRequestException, PipeTransform } from "@nestjs/common";

const getErrorMessage = <T>(value: T) => `"${value}" не является числом`

export class ParseIntPipe implements PipeTransform {
  transform(value: string): number {
    const num = Number(value)
    if (isNaN(num)) {
      throw new BadRequestException(getErrorMessage(value));
    }


    if (!Number.isInteger(num)) {
      throw new BadRequestException(getErrorMessage(value));
    }

    return Number(value);
  }
}
