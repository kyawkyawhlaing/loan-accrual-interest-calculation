import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { MatCardModule } from '@angular/material/card';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-accrued-interest-receivable-stf',
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
    providers: [ DatePipe ],
    templateUrl: './accrued-interest-receivable-stf.component.html',
    styleUrl: './accrued-interest-receivable-stf.component.scss',
})
export class AccruedInterestReceivableSTFComponent {
    src!: Blob;
    fileName: string;

    protected readonly form: FormGroup = new FormGroup({});

    private url = environment.apiUrl;
    private http = inject(HttpClient);
    private fb = inject(FormBuilder);

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
                this.url + 'Report/GetAccruedInterestReceivableForSTF', 
                {
                    startDate: this.datePipe.transform(this.form.value.startDate as Date, 'yyyy-MM-dd'),
                    endDate: this.datePipe.transform(this.form.value.endDate as Date, 'yyyy-MM-dd'),
                    format: (this.form.value.format as string).toLowerCase(),
                    reportFullName: '2100-0055.jrxml'
                },
                { observe: 'response', responseType: 'blob' }
            )
            .subscribe({
                next: (response) => {
                    this.fileName = response.headers.get('content-disposition')?.split('filename=')[1]?.trim().replace(/"/g, '') || 'unknown';

                    if (this.form.value.format.toLowerCase() === 'pdf') {
                        const blob = new File([response.body!], this.fileName, {
                            type: 'application/pdf',
                        });
                        this.src = blob;
                    }
                    if (this.form.value.format.toLowerCase() === 'excel') {
                        const blob = new File([response.body!], this.fileName, {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        });
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
