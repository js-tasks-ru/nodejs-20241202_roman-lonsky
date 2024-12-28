import {ArgumentsHost, ExceptionFilter, HttpException} from "@nestjs/common";
import {Response, Request} from 'express';
import * as fs from 'node:fs';

export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // if (!exception.getStatus) {
    //   throw exception
    // }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // console.log(exception);
    const status = exception.getStatus ? exception.getStatus() : 500;
    const message = exception.message;

    const date = new Date().toISOString();

    fs.appendFileSync('errors.log', `[${date}] ${status} - ${message}\n`);

    response
      .status(status)
      .json({
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.path,
        error: null,
      });
  }
}
