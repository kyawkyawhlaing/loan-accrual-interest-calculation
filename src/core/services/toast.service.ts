import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private router = inject(Router);

  constructor() {
    this.createToastContainer();
  }

  private createToastContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'app-toast-container';
      document.body.appendChild(container);
    }
  }

  private createToastElement(
    message: string,
    alertClass: string,
    duration = 5000,
    avatar?: string,
    route?: string
  ) {
    const toastMessage = (message || '').trim();
    if (!toastMessage) {
      return;
    }

    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass, 'app-toast', 'font-semibold', 'shadow-lg', 'flex', 'items-center', 'gap-3', 'cursor-pointer', 'justify-between');

    if (route) {
      toast.addEventListener('click', () => this.router.navigateByUrl(route))
    }

    toast.innerHTML = `
      ${avatar ? `<img src=${avatar || '/user.png'} class='w-10 h-10 rounded'` : ''}
      <span class="app-toast-message">${toastMessage}</span>
      <button type="button" class="app-toast-close" aria-label="Close">x</button>
    `;
    toast.querySelector('button')?.addEventListener('click', (event) => {
      event.stopPropagation();
      toastContainer.removeChild(toast);
    });

    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, duration);
  }

  success(message: string, duration?: number, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-success', duration, avatar, route);
  }

  error(message: string, duration?: number, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-danger', duration, avatar, route);
  }

  warning(message: string, duration?: number, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-warning', duration, avatar, route);
  }

  info(message: string, duration?: number, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-info', duration, avatar, route);
  }
}
