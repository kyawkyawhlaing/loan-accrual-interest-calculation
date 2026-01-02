import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
    selector: 'app-income-and-sundry-details',
    imports: [
        NgxExtendedPdfViewerModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatButtonModule
    ],
    templateUrl: 'income-and-sundry-details.component.html',
    styleUrl: 'income-and-sundry-details.component.scss',
})
export class IncomeAndSundryDetailsComponent {
    src: Blob;
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);

    protected readonly form: FormGroup = new FormGroup({});

    constructor() {

    }
    
    onSubmit(): void {
        this.http
            .post(
                'report/GetLoanAccountIncomeAndSundryDetails',
                {},
                { responseType: 'blob' }
            )
            .subscribe({
                next: (response) => {
                    this.src = response;
                    this.form.reset(this.form.value);
                    this.form.markAsPristine();
                    this.form.markAsUntouched();
                }
            });
    }
}
