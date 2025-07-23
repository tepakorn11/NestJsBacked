import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();

    const method = req.method;
    const url = req.originalUrl;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        console.log(
          `📥 [${method}] ${url} ➜ done in ${duration}ms`,
        );
      }),
    );
  }
}
