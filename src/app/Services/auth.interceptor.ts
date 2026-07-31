import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorService } from './error.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  const errorService = inject(ErrorService);
  const token = cookieService.get('access_token');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let message: string | null = null;

      if (error.status === 0) {
        message = 'Unable to reach the server. Please check your connection and try again.';
      } else if (error.status === 500) {
        message = 'A server error occurred. Please try again later.';
      }

      if (message !== null) {
        errorService.showError(message, () => {
          cookieService.delete('store_id', '/');
          cookieService.delete('access_token', '/');
          router.navigate(['/login']);
        });
      }

      return throwError(() => error);
    })
  );
};
