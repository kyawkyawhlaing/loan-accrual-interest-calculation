import { inject, Injectable } from '@angular/core';

import { catchError, from, of, switchMap } from 'rxjs';
import { AccountService } from './account.service';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService);
  private signalrService = inject(SignalrService);

  init() {
    return this.accountService.getUserInfo().pipe(
      switchMap((user) => {
        if (!user) {
          return of(null);
        }

        return from(this.signalrService.startConnection()).pipe(
          catchError(() => of(null)),
          switchMap(() => of(user))
        );
      }),
      catchError(() => of(null))
    );
  }
}
