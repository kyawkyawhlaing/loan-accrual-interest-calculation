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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
export class IncomeAndSundryDetailsComponent implements OnDestroy {
    src!: SafeResourceUrl;

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
                    const blob = response.body!;
                    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(
                        URL.createObjectURL(blob)
                    );
                    this.form.reset(this.form.value);
                    this.form.markAsPristine();
                    this.form.markAsUntouched();
                },
            });
    }

    ngOnDestroy(): void {
        if (this.src) {
            const url = (this.src as any).changingThisBreaksApplicationSecurity;
            URL.revokeObjectURL(url);
        }
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
