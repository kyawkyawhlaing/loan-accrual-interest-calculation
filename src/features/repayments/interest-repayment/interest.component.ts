import { Component, DestroyRef, inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Editor, NgxEditorModule, Toolbar } from "ngx-editor";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { RouterLink } from "@angular/router";
import { FileUploadModule } from "@iplab/ngx-file-upload";
import { CustomizerSettingsService } from "../../../core/customizer-settings/customizer-settings.service";
import { ThousandSeparatorDirective } from "../../../shared/directives/thousand-separator.directive";
import { InterestService } from "./interest.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomSnackbarComponent } from "../../../shared/alert/custom-snackbar.component";
import { UtilsService } from "../../../core/services/utils.service";
import { UppercaseDirective } from "../../../shared/directives/uppercase.directive";


@Component({
    selector: 'app-interest',
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
    templateUrl: 'interest.component.html',
    styleUrl: 'interest.component.scss',
})
export class InterestComponent {
    private fb = inject(FormBuilder);
    private snackBar = inject(MatSnackBar);
    private voucherService = inject(InterestService);
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

        this.themeService.isToggled$.subscribe((isToggled) => {
            this.isToggled = isToggled;
        });
    }

    onSubmit() {
        this.voucherService
            .createRepaymentVoucher({
                ...this.form.value,
                paymentAmt: this.utilsService.parseAmount(
                    this.form.value.paymentAmt
                ),
            })
            .subscribe({
                next: (response) => {
                    this.form.reset();
                    this.form.markAsPristine();
                    this.form.markAsUntouched();
                    this.snackBar.openFromComponent(CustomSnackbarComponent, {
                        data: {
                            message: 'Principal voucher is saved successfully!',
                        },
                        verticalPosition: 'top',
                        horizontalPosition: 'center',
                        panelClass: ['snackbar-success'],
                    });
                },
                error: (error) => {
                    this.snackBar.openFromComponent(CustomSnackbarComponent, {
                        data: { message: error.error.message },
                        verticalPosition: 'top',
                        horizontalPosition: 'center',
                        panelClass: ['snackbar-error'],
                    });
                },
            });
    }

    onLoanAccountEnter() {
        const loanAcctNum = this.form.value?.loanAcctNum;

        if (!loanAcctNum) return;

        const subscription = this.voucherService.getLoanByAccountNumber(loanAcctNum)
            .subscribe({
                next: (loan) => {
                    if (!loan) return;

                    this.form.patchValue({
                        productCode: loan.productCode,
                        ccy: loan.ccy
                    });

                    this.form.get('productCode')?.disable();
                    this.isReadonly = true;
                },
                error: () => {
                    this.form.reset();
                    this.form.markAsUntouched();

                    this.isReadonly = true;

                }
            });

        this.destroyRef.onDestroy(() => subscription.unsubscribe());
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
