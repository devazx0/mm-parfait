import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    if (!req) return next.handle();

    const { method, url, query, ip } = req;
    const body: unknown = req.body;
    const userAgent = req.get('user-agent') || '';
    const now = Date.now();

    const sanitizedBody = this.sanitize(body);
    const sanitizedQuery = this.sanitize(query);

    this.logger.log(
      `[REQ] ${method} ${url} | IP: ${ip} | UA: ${userAgent} | Query: ${JSON.stringify(
        sanitizedQuery,
      )} | Body: ${JSON.stringify(sanitizedBody)}`,
    );

    return next.handle().pipe(
      tap((responseData) => {
        const response = context.switchToHttp().getResponse<Response>();
        const statusCode = response.statusCode;
        const delay = Date.now() - now;
        const sanitizedResponse = this.sanitizeData(responseData);

        this.logger.log(
          `[RES] ${method} ${url} ${statusCode} +${delay}ms | Data: ${JSON.stringify(
            sanitizedResponse,
          )}`,
        );
      }),
      catchError((error: Error & { status?: number; response?: unknown }) => {
        const delay = Date.now() - now;
        const statusCode = error.status || 500;
        const errorResponse = error.response ?? error.message;

        this.logger.error(
          `[ERR] ${method} ${url} ${statusCode} +${delay}ms | Error: ${JSON.stringify(
            errorResponse,
          )}`,
          error.stack,
        );

        return throwError(() => error);
      }),
    );
  }

  private sanitize(obj: unknown): unknown {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map((item) => this.sanitize(item));

    const sensitiveKeys = [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'secret',
    ];
    const sanitized: Record<string, unknown> = {};

    for (const key of Object.keys(obj)) {
      const value = (obj as Record<string, unknown>)[key];
      if (
        sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))
      ) {
        sanitized[key] = '***';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private sanitizeData(data: unknown): unknown {
    if (!data) return data;
    const str = JSON.stringify(data);
    if (str && str.length > 1000) {
      return `${str.substring(0, 1000)}... (truncated ${str.length - 1000} chars)`;
    }
    return this.sanitize(data);
  }
}
