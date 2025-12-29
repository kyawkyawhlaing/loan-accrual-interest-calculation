// custom-snackbar.component.ts
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
    MAT_SNACK_BAR_DATA,
    MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
    selector: 'app-custom-snackbar',
    imports: [CommonModule],
    template: `
        <div class="flex items-center justify-between" [ngClass]="getClass()">
            <span>{{ data.message }}</span>
            <button (click)="close()" class="ml-4">
                <i class="ri-close-line"></i>
            </button>
        </div>
    `,
    styles: [
        `
            div {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem 1rem;
                border-radius: 0.25rem;
                color: white;
            }
            .success {
                background-color: #4caf50;
            }
            .error {
                background-color: #f44336;
            }
            .warn {
                background-color: #ff9800;
            }
            .info {
                background-color: #2196f3;
            }

            button {
                background: transparent;
                border: none;
                cursor: pointer;
                color: inherit;
            }
        `,
    ],
})
export class CustomSnackbarComponent {
    constructor(
        private snackBarRef: MatSnackBarRef<CustomSnackbarComponent>,
        @Inject(MAT_SNACK_BAR_DATA) public data: any
    ) {}

    close() {
        this.snackBarRef.dismiss();
    }

    getClass() {
        switch (this.data.type) {
            case 'success':
                return 'success';
            case 'error':
                return 'error';
            case 'warn':
                return 'warn';
            case 'info':
                return 'info';
            default:
                return '';
        }
    }
}
