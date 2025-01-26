import {ArgumentsHost, Catch, ExceptionFilter, BadRequestException} from "@nestjs/common";
import {Response} from "express";
import mongoose from "mongoose";

@Catch(mongoose.Error.ValidationError, mongoose.mongo.MongoError)
export class MongoFilter implements ExceptionFilter {
  catch(exception: {code: number, message: string, errorResponse: {keyPattern: Record<string, any>}}, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(400)
      .json(new BadRequestException(exception.message).getResponse())
  }
}
