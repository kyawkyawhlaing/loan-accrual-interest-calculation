import { inject, Injectable } from '@angular/core';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private alertService = inject(AlertService);

  success(message: string) {
    this.alertService.showSuccess(message);
  }

  error(message: string) {
    this.alertService.showError(message);
  }

  warning(message: string) {
    this.alertService.show(message, 'Warning');
  }

  info(message: string) {
    this.alertService.show(message, 'Info');
  }
}
