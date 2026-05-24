import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const { method, originalUrl } = request;
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () =>
          this.log(method, originalUrl, response.statusCode, startedAt),
        error: () =>
          this.log(method, originalUrl, response.statusCode || 500, startedAt),
      }),
    );
  }

  private log(
    method: string,
    url: string,
    status: number,
    startedAt: number,
  ): void {
    const elapsedMs = Date.now() - startedAt;
    this.logger.log(`${method} ${url} ${status} (${elapsedMs}ms)`);
  }
}
