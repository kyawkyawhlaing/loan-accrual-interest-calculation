// src/app/interceptors/credentials.interceptor.ts
import {
  HttpInterceptorFn} from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  // Clone the request to add withCredentials
  const clonedRequest = req.clone({
    withCredentials: true
  });

  // Pass it to the next handler
  return next(clonedRequest);
};
