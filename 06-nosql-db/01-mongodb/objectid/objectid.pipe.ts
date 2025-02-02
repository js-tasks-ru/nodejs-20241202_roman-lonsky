import {BadRequestException, Injectable, PipeTransform, } from "@nestjs/common";
import {isValidObjectId} from "mongoose";

@Injectable()
export class ObjectIDPipe implements PipeTransform {
  async transform(value: string) {

    const valid = isValidObjectId(value);

    if (!valid) {
      throw new BadRequestException('not a valid object id');
    }

    return value;
  }
}
