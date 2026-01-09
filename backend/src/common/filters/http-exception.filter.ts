import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ValidationError {
  field: string;
  message: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Manejar errores de validación (Bad Request)
    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse();
      const validationErrors = this.extractValidationErrors(exceptionResponse);

      if (validationErrors.length > 0) {
        return response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Validation failed',
          details: validationErrors,
        });
      }
    }

    // Manejar otros errores HTTP
    const message =
      exception instanceof HttpException
        ? this.extractMessage(exception.getResponse())
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private extractValidationErrors(response: any): ValidationError[] {
    const errors: ValidationError[] = [];

    // Si tiene array de mensajes (errores de class-validator)
    if (response.message && Array.isArray(response.message)) {
      (response.message as string[]).forEach((error: string) => {
        const field = this.extractFieldFromMessage(error);
        errors.push({ field, message: error });
      });
    }

    return errors;
  }

  private extractFieldFromMessage(message: string): string {
    const match = message.match(/^(\w+)\s/);
    return match ? match[1] : 'unknown';
  }

  private extractMessage(response: any): string {
    if (typeof response === 'string') {
      return response;
    }

    if (response.message) {
      if (typeof response.message === 'string') {
        return response.message as string;
      }
      if (Array.isArray(response.message)) {
        return (response.message as string[]).join(', ');
      }
    }

    if (response.error && typeof response.error === 'string') {
      return response.error as string;
    }

    return 'An error occurred';
  }
}
