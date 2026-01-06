import { Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-overdue-fee-income-and-sundry-details',
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
        MatSelectModule
    ],
    providers: [DatePipe],
    templateUrl: './overdue-fee-income-and-sundry-details.component.html',
    styleUrl: './overdue-fee-income-and-sundry-details.component.scss',
})
export class OverdueFeeIncomeAndSundryDetailsComponent {
    src!: Blob;
    fileName: string;

    private baseUrl = environment.apiUrl;
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);

    protected readonly form : FormGroup = new FormGroup({});

    // Format Type Select
    format = new FormControl('');
    formatList: string[] = ['PDF', 'EXCEL'];

    constructor(private datePipe: DatePipe) {
        this.form = this.fb.group({
            startDate: ['', [Validators.required]], 
            endDate: ['', [Validators.required]],
            format: ['', Validators.required]
        });
    }

    onSubmit(): void {
        this.http
            .post(
                this.baseUrl + 'Report/GetLoanPrincipleOverdueFeeIncomeAndSundryDetail',
                {
                    startDate: this.datePipe.transform(
                        this.form.value.startDate as Date, 'yyyy-MM-dd'
                    ),
                    endDate: this.datePipe.transform(this.form.value.endDate as Date, 'yyyy-MM-dd'),
                    format: (this.form.value.format as string).toLowerCase(),
                    reportFullName:
                        'Loan_Principal_Overdue_Fee_Income_And_Sundry_Details.jrxml',
                },
                { observe: 'response', responseType: 'blob' }
            )
            .subscribe({
                next: (response) => {
                    this.fileName = response.headers.get('content-disposition')?.split('filename=')[1]?.trim().replace(/"/g, '') || 'unknown';
                    
                    if (this.form.value.format.toLowerCase() === 'pdf') {
                        const blob = new File([response.body!], this.fileName, {type: 'application/pdf' });
                        this.src = blob;
                    }
                    if (this.form.value.format.toLowerCase() === 'excel') {
                        const blob = new File([response.body!], this.fileName, {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });   
                        saveAs(blob, this.fileName);
                    }
                    this.form.reset(this.form.value);
                    this.form.markAsPristine();
                    this.form.markAsUntouched();
                }
            })
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

    get formatIsRequired() {
        return (
            this.form.get('format')!.hasError('required') &&
            this.form.get('format')!.touched
        );
    }
}
