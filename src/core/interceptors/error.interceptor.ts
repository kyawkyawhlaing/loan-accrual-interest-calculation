import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { catchError, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const alertService = inject(AlertService);

  return next(req).pipe(
    catchError(error => {
      if (error) {
          switch(error.status) {
            case 400:
                alertService.showError(
                  error.error?.detail || error.error?.message || 'Bad request'
                );
              break;
            case 401:
                alertService.showError('Unauthorized');
              break;
            case 404:
              router.navigateByUrl('/not-found')
              break;
            case 500:
                alertService.showError(
                  error.error?.detail || error.error?.message || 'Server error'
                );
              break;

            default:
                alertService.showError('Something went wrong');
                break;
          }
      }
      console.log('error second time', error)
      return throwError(() => error);
    })
  );
};
