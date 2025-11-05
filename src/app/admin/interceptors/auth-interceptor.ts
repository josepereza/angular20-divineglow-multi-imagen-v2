// auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toastService.show('Tu sesión ha expirado. Inicia sesión nuevamente.');
      }
      if (error.status === 403) {
        toastService.show('No tienes permisos para realizar esta acción.', 'bg-warning text-dark');
      }
      return throwError(() => error);
    })
  );
};
