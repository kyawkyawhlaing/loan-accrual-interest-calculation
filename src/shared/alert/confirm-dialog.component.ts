import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

export interface ConfirmDialogDetail {
    label: string;
    value: string;
}

@Component({
    selector: 'app-confirm-dialog',
    imports: [MatButtonModule, MatCardModule],
    template: `
        <div class="confirm-popup active" (click)="onCancel()">
            <div class="popup-dialog" (click)="$event.stopPropagation()">
                <mat-card class="daxa-card border-radius bg-white border-none d-block">
                    <div class="confirm-header d-flex align-items-center justify-content-between">
                        <h5 class="mt-0 mb-0">{{ title }}</h5>
                        <button mat-button type="button" class="close-btn" (click)="onCancel()" aria-label="Close">
                            <i class="ri-close-line"></i>
                        </button>
                    </div>

                    <mat-card-content>
                        <p class="confirm-message mb-0">{{ message }}</p>

                        @if (countdown !== null) {
                            <div class="confirm-countdown">
                                <span class="confirm-countdown__value">{{ countdown }}</span>
                                <span class="confirm-countdown__label">second{{ countdown === 1 ? '' : 's' }}</span>
                            </div>
                        }

                        @if (details.length) {
                            <div class="confirm-details">
                                @for (detail of details; track detail.label) {
                                    <div class="confirm-row d-flex justify-content-between">
                                        <span class="confirm-label">{{ detail.label }}</span>
                                        <span class="confirm-value">{{ detail.value }}</span>
                                    </div>
                                }
                            </div>
                        }

                        <div class="btn-box">
                            @if (showConfirm) {
                                <button mat-button type="button" (click)="onConfirm()">
                                    {{ confirmText }}
                                </button>
                            }
                            @if (showCancel) {
                                <button mat-button type="button" (click)="onCancel()">
                                    {{ cancelText }}
                                </button>
                            }
                        </div>
                    </mat-card-content>
                </mat-card>
            </div>
        </div>
    `,
    styles: [
        `
            .confirm-popup {
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 9999;
                position: fixed;
                transition: 0.3s;
                background-color: rgba(0, 0, 0, 0.5);
                overflow-x: hidden;
                overflow-y: auto;
            }

            .popup-dialog {
                display: flex;
                max-width: 550px;
                align-items: center;
                min-height: calc(100% - 3.5rem);
                margin-left: auto;
                margin-right: auto;
                padding: 1.75rem 15px;
            }

            .daxa-card {
                width: 100%;
                padding: 20px;
            }

            .confirm-header {
                border-bottom: 1px solid #eeeeee;
                margin-left: -20px;
                margin-right: -20px;
                padding: 0 20px 18px;
                margin-bottom: 18px;
            }

            .confirm-header h5 {
                font-size: 18px;
                font-weight: 500;
                color: var(--blackColor);
            }

            .confirm-header .close-btn {
                padding: 0;
                height: auto;
                line-height: 1;
                min-width: auto;
                font-size: 23px !important;
            }

            .confirm-message {
                font-size: 15px;
                color: var(--bodyColor);
                line-height: 1.6;
                margin-bottom: 16px !important;
            }

            .confirm-countdown {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 8px 0 20px;
                padding: 18px 16px;
                border: 1px solid #eeeeee;
                border-radius: 6px;
            }

            .confirm-countdown__value {
                font-size: 48px;
                font-weight: 700;
                line-height: 1;
                color: var(--daxaColor);
            }

            .confirm-countdown__label {
                margin-top: 8px;
                font-size: 14px;
                color: var(--bodyColor);
            }

            .confirm-details {
                border: 1px solid #eeeeee;
                border-radius: 6px;
                padding: 14px 16px;
                margin-bottom: 20px;
            }

            .confirm-row {
                padding: 6px 0;
                gap: 16px;
            }

            .confirm-row:not(:last-child) {
                border-bottom: 1px solid #f3f3f3;
            }

            .confirm-label {
                font-size: 14px;
                color: var(--bodyColor);
            }

            .confirm-value {
                font-size: 14px;
                font-weight: 500;
                color: var(--blackColor);
                text-align: right;
                word-break: break-word;
            }

            .btn-box {
                text-align: right;
            }

            .btn-box .mat-mdc-button {
                border: 0;
                height: auto;
                min-width: auto;
                min-height: auto;
                padding: 12px 35px;
                font-weight: normal;
                color: var(--whiteColor);
                font-size: 15px !important;
                border: 1px solid var(--daxaColor);
                background-color: var(--daxaColor);
            }

            .btn-box .mat-mdc-button:not(:first-child) {
                margin-left: 10px;
                border-color: #c2cada;
                color: var(--blackColor);
                background-color: transparent;
            }
        `,
    ],
})
export class ConfirmDialogComponent {
    @Input() title = 'Confirm';
    @Input() message = '';
    @Input() confirmText = 'Confirm';
    @Input() cancelText = 'Cancel';
    @Input() showCancel = true;
    @Input() showConfirm = true;
    @Input() countdown: number | null = null;
    @Input() details: ConfirmDialogDetail[] = [];

    @Output() confirmed = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    onCancel(): void {
        this.cancelled.emit();
    }

    onConfirm(): void {
        this.confirmed.emit();
    }
}
