import { Component, DestroyRef, ViewChild, inject } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormGroupDirective,
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
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { catchError, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { CustomizerSettingsService } from '../../../core/customizer-settings/customizer-settings.service';
import { ThousandSeparatorDirective } from '../../../shared/directives/thousand-separator.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../../../shared/alert/custom-snackbar.component';
import { LatefeeService } from './latefee.service';
import { UtilsService } from '../../../core/services/utils.service';
import { UppercaseDirective } from '../../../shared/directives/uppercase.directive';

@Component({
    selector: 'app-latefee',
    imports: [
        ThousandSeparatorDirective,
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        FileUploadModule,
        NgxEditorModule,
        UppercaseDirective
    ],
    templateUrl: 'latefee.component.html',
    styleUrl: 'latefee.component.scss',
})
export class LatefeeComponent {
    @ViewChild(FormGroupDirective) private formGroupDirective?: FormGroupDirective;

    private fb = inject(FormBuilder);
    private snackBar = inject(MatSnackBar);
    private voucherService = inject(LatefeeService);
    private utilsService = inject(UtilsService);
    private destroyRef = inject(DestroyRef);

    protected form: FormGroup = new FormGroup({});

    isReadonly = false;

    // Text Editor
    editor: Editor;
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link', 'image'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    ngOnInit(): void {
        this.editor = new Editor();
    }

    // make sure to destory the editor
    ngOnDestroy(): void {
        this.editor.destroy();
    }

    // Product Code Select
    product = new FormControl('');
    productList: string[] = ['DCF', 'FCF', 'PEF', 'INF', 'STF'];

    // isToggled
    isToggled = false;

    constructor(public themeService: CustomizerSettingsService) {
        this.form = this.fb.group({
            loanAcctNum: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(20),
                ],
            ],
            productCode: ['', Validators.required],
            paymentAmt: ['', [Validators.required]],
            ccy: ['', [Validators.required, Validators.maxLength(4)]],
            narrationDetails: [''],
        });

        const loanAcctControl = this.form.get('loanAcctNum');
        loanAcctControl?.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((value: string) => {
                if (!value) {
                    this.clearLoanRelatedDetails();
                    return of(null);
                }

                if (value.length < 6) {
                    return of(null);
                }

                return this.voucherService.getLoanByAccountNumber(value).pipe(
                    catchError(() => of(null))
                );
            })
        ).subscribe((loan: any) => {
            if (loan && loan.productCode && loan.ccy) {
                this.form.patchValue({
                    productCode: loan.productCode,
                    ccy: loan.ccy,
                });
                this.form.get('productCode')?.disable();
                this.isReadonly = true;
                return;
            }

            if (this.form.get('loanAcctNum')?.value) {
                this.clearLoanRelatedDetails();
            }
        });

        this.themeService.isToggled$.subscribe((isToggled) => {
            this.isToggled = isToggled;
        });
    }

    onSubmit() {
        const voucher = this.form.getRawValue();

        this.voucherService
            .createRepaymentVoucher({
                ...voucher,
                paymentAmt: this.utilsService.parseAmount(voucher.paymentAmt),
            })
            .subscribe({
                next: (response) => {
                    this.resetForm();
                    this.snackBar.openFromComponent(CustomSnackbarComponent, {
                        data: {
                            message: 'Latefee voucher is saved successfully!',
                        },
                        verticalPosition: 'top',
                        horizontalPosition: 'center',
                        panelClass: ['snackbar-success'],
                    });
                },
                error: (error) => {
                    console.log(error);
                },
            });
    }

    private resetForm() {
        const resetState = {
            loanAcctNum: '',
            productCode: '',
            paymentAmt: '',
            ccy: '',
            narrationDetails: '',
        };

        this.form.reset(resetState);
        this.formGroupDirective?.resetForm(resetState);
        this.form.get('productCode')?.enable();
        this.isReadonly = false;
    }

    onLoanAccountEnter() {
        const loanAcctNum = this.form.value?.loanAcctNum;

        if (!loanAcctNum || loanAcctNum.length < 6) return;

        const subscription = this.voucherService.getLoanByAccountNumber(loanAcctNum)
            .pipe(catchError(() => of(null)))
            .subscribe((loan: any) => {
                if (loan && loan.productCode && loan.ccy) {
                    this.form.patchValue({
                        productCode: loan.productCode,
                        ccy: loan.ccy,
                    });
                    this.form.get('productCode')?.disable();
                    this.isReadonly = true;
                    return;
                }

                this.clearLoanRelatedDetails();
            });

        this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }

    private clearLoanRelatedDetails() {
        this.form.get('productCode')?.enable();
        this.form.patchValue({
            productCode: '',
            ccy: '',
        });
        this.isReadonly = false;
    }

    // Dark Mode
    toggleTheme() {
        this.themeService.toggleTheme();
    }

    get loanAccountNumberIsRequired() {
        return (
            this.form.get('loanAcctNum')!.hasError('required') &&
            this.form.get('loanAcctNum')!.touched
        );
    }

    get loanAccountNumberIsInvalid() {
        return (
            (this.form.get('loanAcctNum')!.hasError('minlength') ||
                this.form.get('loanAcctNum')!.hasError('maxlength')) &&
            this.form.get('loanAcctNum')!.touched
        );
    }

    get productCodeIsRequired() {
        return (
            this.form.get('productCode')!.hasError('required') &&
            this.form.get('productCode')!.touched
        );
    }

    get paymentAmtIsRequired() {
        return (
            this.form.get('paymentAmt')!.hasError('required') &&
            this.form.get('paymentAmt')!.touched
        );
    }

    get currencyCodeIsRequired() {
        return (
            this.form.get('ccy')!.hasError('required') &&
            this.form.get('ccy')!.touched
        );
    }
}
