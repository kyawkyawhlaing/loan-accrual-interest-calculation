// custom-snackbar.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  template: `
    <div class="flex items-center justify-between">
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
      }
      button {
        background: transparent;
        border: none;
        cursor: pointer;
      }
    `
  ]
})
export class CustomSnackbarComponent {
  constructor(
    private snackBarRef: MatSnackBarRef<CustomSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  close() {
    this.snackBarRef.dismiss();
  }
}
