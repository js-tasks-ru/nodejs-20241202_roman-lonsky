import {NestInterceptor, ExecutionContext, CallHandler} from "@nestjs/common";
import {map, tap} from "rxjs/operators";

export class ApiVersionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const start = Date.now()

    return next.handle().pipe(
      map((request) => {
        return {
          ...request,
          apiVersion: "1.0",
          executionTime: Date.now() - start + 'ms'
        }
      }),
      tap((request) => {
        console.log('executionTime', request.executionTime)
      }));
  }
}
