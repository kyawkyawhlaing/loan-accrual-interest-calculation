import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { environment } from '../../../environments/environment.development';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-income-and-sundry-details',
    imports: [
        NgxExtendedPdfViewerModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
    ],
    templateUrl: 'income-and-sundry-details.component.html',
    styleUrl: 'income-and-sundry-details.component.scss',
})
export class IncomeAndSundryDetailsComponent {
    src!: Blob;
    fileName: string;

    private baseUrl = environment.apiUrl;
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private sanitizer = inject(DomSanitizer);

    protected readonly form: FormGroup = new FormGroup({});

    constructor() {
        this.form = this.fb.group({
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
        });
    }

    onSubmit(): void {
        this.http
            .post(
                this.baseUrl + 'Report/GetLoanAccountIncomeAndSundryDetails',
                {
                    startDate: (
                        this.form.value.startDate as Date
                    ).toISOString(),
                    endDate: (this.form.value.endDate as Date).toISOString(),
                    format: 'pdf',
                    reportFullName:
                        'Loan_Account_Income_and_Sundry_Details.jrxml',
                },
                { observe: 'response', responseType: 'blob' }
            )
            .subscribe({
                next: (response) => {
                    this.fileName = response.headers.get('content-disposition')?.split('filename=')[1]?.trim().replace(/"/g, '') || 'unknown';

                    const blob = new File([response.body!], this.fileName, {type: 'application/pdf' });
                    this.src = blob;


                    this.form.reset(this.form.value);
                    this.form.markAsPristine();
                    this.form.markAsUntouched();
                },
            });
    }

    get startDateIsRequired() {
        return (
            this.form.get('startDate')!.hasError('required') &&
            this.form.get('startDate')!.touched
        );
    }

    get endDateIsRequired() {
        return (
            this.form.get('endDate')!.hasError('required') &&
            this.form.get('endDate')!.touched
        );
    }
}
