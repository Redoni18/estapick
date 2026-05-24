import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';

interface ErrorResponseBody {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
  error: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { message, error } = this.normalize(exception, status);

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status} ${this.stringify(message)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    const path =
      (httpAdapter.getRequestUrl(request) as string | undefined) ?? request.url;

    const body: ErrorResponseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path,
      message,
      error,
    };

    httpAdapter.reply(ctx.getResponse(), body, status);
  }

  private normalize(
    exception: unknown,
    status: number,
  ): { message: string | string[]; error: string } {
    if (exception instanceof HttpException) {
      const response: unknown = exception.getResponse();
      if (typeof response === 'string') {
        return { message: response, error: exception.name };
      }
      const obj = response as {
        message?: string | string[];
        error?: string;
      };
      return {
        message: obj.message ?? exception.message,
        error: obj.error ?? exception.name,
      };
    }

    return {
      message:
        exception instanceof Error
          ? exception.message
          : 'Internal server error',
      error:
        (HttpStatus as unknown as Record<number, string>)[status] ?? 'Error',
    };
  }

  private stringify(message: string | string[]): string {
    return Array.isArray(message) ? message.join(', ') : message;
  }
}
