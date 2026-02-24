import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseResponseDto } from '../dtos/base-response.dto';

@Catch()
export class BaseResponseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          BaseResponseDto.fail('Internal Server Error', [
            'An unexpected error occurred.',
          ]),
        );
      return;
    }

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as
      | string
      | { message?: string | string[]; error?: string };

    const resolvedMessage =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse?.error || exception.message;

    const details =
      typeof exceptionResponse === 'string'
        ? [exceptionResponse]
        : Array.isArray(exceptionResponse?.message)
          ? exceptionResponse.message
          : [exceptionResponse?.message || exception.message];

    response.status(status).json({
      ...BaseResponseDto.fail(resolvedMessage, details),
      Path: request.url,
      Timestamp: new Date().toISOString(),
    });
  }
}
