import { Component, inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Editor, NgxEditorModule, Toolbar, Validators } from "ngx-editor";
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
import { ToastService } from "../../../core/services/toast.service";


@Component({
    selector: 'app-interest',
    imports: [ThousandSeparatorDirective, MatCardModule, MatMenuModule, MatButtonModule, RouterLink, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, FileUploadModule, NgxEditorModule],
    templateUrl: 'interest.component.html',
    styleUrl: 'interest.component.scss'
})
export class InterestComponent {
    private fb = inject(FormBuilder);
    private toast = inject(ToastService);

    protected form: FormGroup = new FormGroup({});

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
    productList: string[] = ['DCF', 'FCF', 'PEF', 'TTF', 'STF'];

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
        console.log(this.form.invalid);
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
