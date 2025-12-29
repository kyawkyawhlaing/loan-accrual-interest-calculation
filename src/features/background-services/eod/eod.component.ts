import { Component, inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RouterLink } from "@angular/router";
import { FileUploadModule } from "@iplab/ngx-file-upload";
import { Editor, NgxEditorModule, Toolbar } from "ngx-editor";
import { CustomizerSettingsService } from "../../../core/customizer-settings/customizer-settings.service";
import { CustomSnackbarComponent } from "../../../shared/alert/custom-snackbar.component";
import { EodService } from "./eod.service";
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
    selector: 'app-eod',
    imports: [
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
        MatProgressBarModule
    ],
    templateUrl: 'eod.component.html',
    styleUrl: 'eod.component.scss',
})
export class EodComponent {
    private fb = inject(FormBuilder);
    private snackBar = inject(MatSnackBar);

    protected eodService = inject(EodService);
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

    // Instructor Select
    product = new FormControl('');
    productList: string[] = ['DCF', 'FCF', 'PEF', 'TTF', 'STF'];

    // isToggled
    isToggled = false;

    constructor(public themeService: CustomizerSettingsService) {
        this.form = this.fb.group({
            eodDate: ['', [Validators.required]],
        });

        this.themeService.isToggled$.subscribe((isToggled) => {
            this.isToggled = isToggled;
        });
    }

    onSubmit() {
        this.eodService.isLoading.set(true);
        this.eodService
            .processEod({
                ...this.form.value,
                eodDate: (this.form.value.eodDate as Date).toISOString(), // convert local time to UTC Timezone
            })
            .subscribe({
                next: () => {
                    this.eodService.isLoading.set(false);
                    this.snackBar.openFromComponent(CustomSnackbarComponent, {
                        data: {
                            message: 'EOD has proceed successfully!',
                        },
                        verticalPosition: 'top',
                        horizontalPosition: 'center',
                        panelClass: ['snackbar-success'],
                    });
                    this.form.reset();
                },
                error: (error) => {
                    this.eodService.isLoading.set(false);
                    console.log(error)
                    this.snackBar.openFromComponent(CustomSnackbarComponent, {
                        data: {
                            message: error.error,
                        },
                        verticalPosition: 'top',
                        horizontalPosition: 'center',
                        panelClass: ['snackbar-error'],
                    });
                },
            });
    }

    // Dark Mode
    toggleTheme() {
        this.themeService.toggleTheme();
    }

    get eodDateIsRequired() {
        return (
            this.form.get('eodDate')!.hasError('required') &&
            this.form.get('eodDate')!.touched
        );
    }
}
