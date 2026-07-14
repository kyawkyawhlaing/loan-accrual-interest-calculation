import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { catchError, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../../shared/alert/custom-snackbar.component';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const showError = (message?: string) => {
    const text = (message || 'Something went wrong').toString().trim();
    if (!text) {
      return;
    }

    snackBar.openFromComponent(CustomSnackbarComponent, {
      data: { message: text, type: 'error' },
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['snackbar-error'],
    });
  };

  return next(req).pipe(
    catchError(error => {
      if (error) {
          switch(error.status) {
            case 400:
                showError(error.error?.detail || error.error?.message || 'Bad request');
              break;
            case 401:
                showError('Unauthorized');
              break;
            case 404:
              router.navigateByUrl('/not-found')
              break;
            case 500:
                showError(error.error?.detail || error.error?.message || 'Server error');
              break;

            default:
                showError('Something went wrong');
                break;
          }
      }
      console.log('error second time', error)
      return throwError(() => error);
    })
  );
};
