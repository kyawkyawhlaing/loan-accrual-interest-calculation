import { HttpEvent, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';

import { delay, finalize, identity, of, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { BusyService } from '../services/busy.service';
import { HttpCacheService } from '../services/http-cache.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);
  const httpCache = inject(HttpCacheService);

  const generateCacheKey = (url: string, params: HttpParams): string => {
    const paramString = params
      .keys()
      .map((key) => `${key}=${params.get(key)}`)
      .join('&');
    return paramString ? `${url}?${paramString}` : url;
  };

  const cacheKey = generateCacheKey(req.url, req.params);

  if (req.method.includes('GET') && req.url.includes('/repayments')) {
    httpCache.invalidate('/repayments');
    httpCache.clear();
  }

  if (req.method.includes('POST') && req.url.includes('/logout')) {
    httpCache.clear();
  }

  if (
    req.method === 'POST' &&
    (req.url.includes('/repayment') ||
      req.url.includes('/eods/process') ||
      req.url.includes('/principal') ||
      req.url.includes('/interest') ||
      req.url.includes('/latefee'))
  ) {
    httpCache.invalidate('loan-accounts');
    httpCache.invalidate('audit-logs');
  }

  if (req.method == 'GET') {
    const cacheResponse = httpCache.get<HttpEvent<unknown>>(cacheKey);
    if (cacheResponse) {
      return of(cacheResponse);
    }
  }

  busyService.busy();

  return next(req).pipe(
    (environment.production ? identity : delay(500)),
    tap((response) => {
      if (req.method === 'GET') {
        httpCache.set(cacheKey, response);
      }
    }),
    finalize(() => {
      busyService.idle();
    })
  );
};
