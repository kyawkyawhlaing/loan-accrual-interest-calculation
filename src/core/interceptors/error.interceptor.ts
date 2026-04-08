import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { catchError, throwError } from 'rxjs';

import { NavigationExtras, Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../../shared/alert/custom-snackbar.component';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError(error => {
      if (error) {
          switch(error.status) {
            case 400:
                const message = error.error.detail;
                snackBar.openFromComponent(CustomSnackbarComponent, {
                    data: { message, type: 'error' },
                    verticalPosition: 'top',
                    horizontalPosition: 'center',
                    panelClass: [`snackbar-error`]
                });

              break;
            case 401:
                snackBar.openFromComponent(CustomSnackbarComponent, {
                    data: { message: 'unauthorized', type: 'error' },
                    verticalPosition: 'top',
                    horizontalPosition: 'center',
                    panelClass: [`snackbar-error`]
                });
              break;
            case 404:
              router.navigateByUrl('/not-found')
              break;
            case 500:
                snackBar.openFromComponent(CustomSnackbarComponent, {
                    data: { message: error.error.detail, type: 'error' },
                    verticalPosition: 'top',
                    horizontalPosition: 'center',
                    panelClass: [`snackbar-error`]
                });
              // const navigationExtras: NavigationExtras = {state: {error: error.error}};
              // router.navigateByUrl('/server-error', navigationExtras);
              break;

            default:
              toast.error('Something went wrong')
                break;
          }
      }
      console.log('error second time', error)
      return throwError(() => error);
    })
  );
};
