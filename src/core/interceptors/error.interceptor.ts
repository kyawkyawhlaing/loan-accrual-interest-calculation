import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { catchError } from 'rxjs';

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
              if (error.error.errors) {
                const modelStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modelStateErrors.push(error.error.errors[key])
                  }
                }
                throw modelStateErrors.flat()
              } else {
                snackBar.openFromComponent(CustomSnackbarComponent, {
                    data: { message: error.error, type: 'error' },
                    verticalPosition: 'top',
                    horizontalPosition: 'center',
                    panelClass: [`snackbar-error`]
                });
              }
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
                console.log(error)
                snackBar.openFromComponent(CustomSnackbarComponent, {
                    data: { message: error.error.message, type: 'error' },
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
      throw error;
    })
  );
};
