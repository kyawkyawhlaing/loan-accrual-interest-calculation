import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlertService {
    visible = signal(false);
    title = signal('Error');
    message = signal('');
    confirmText = signal('OK');

    showError(message: string, title = 'Error') {
        this.show(message, title);
    }

    showSuccess(message: string, title = 'Successful') {
        this.show(message, title);
    }

    show(message: string, title = 'Error', confirmText = 'OK') {
        const text = (message || '').toString().trim();
        if (!text) {
            return;
        }

        this.title.set(title);
        this.message.set(text);
        this.confirmText.set(confirmText);
        this.visible.set(true);
    }

    close() {
        this.visible.set(false);
        this.message.set('');
    }
}
