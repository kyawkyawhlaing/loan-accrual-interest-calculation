import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CustomizerSettingsService } from '../../core/customizer-settings/customizer-settings.service';
import { SignalrService } from '../../core/services/signalr.service';
import { AuditLog, AuditLogParams } from '../../shared/types/audit-log';
import { AuditLogService } from './audit-log.service';

@Component({
    selector: 'app-audit-log',
    imports: [
        DatePipe,
        MatCardModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
    ],
    providers: [DatePipe],
    templateUrl: 'audit-log.component.html',
    styleUrl: 'audit-log.component.scss',
})
export class AuditLogComponent {
    displayedColumns: string[] = [
        'occurredAt',
        'userName',
        'userId',
        'action',
        'loanAccountNumber',
        'description',
    ];
    dataSource = new MatTableDataSource<AuditLog>();

    private destroyRef = inject(DestroyRef);
    private auditLogService = inject(AuditLogService);
    private signalrService = inject(SignalrService);
    private fb = inject(FormBuilder);
    private datePipe = inject(DatePipe);

    protected auditLogParams = new AuditLogParams();
    protected readonly filterForm: FormGroup = this.fb.group({
        date: [null],
    });

    @ViewChild(MatPaginator) paginator: MatPaginator;

    isToggled = false;

    constructor(public themeService: CustomizerSettingsService) {
        this.themeService.isToggled$.subscribe((isToggled) => {
            this.isToggled = isToggled;
        });
    }

    ngAfterViewInit() {
        this.loadData();

        this.paginator.page.subscribe(() => {
            this.auditLogParams.pageNumber = this.paginator.pageIndex + 1;
            this.auditLogParams.pageSize = this.paginator.pageSize;
            this.loadData();
        });

        this.signalrService.refresh$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((tables) => {
                if (tables.includes('audit-logs')) {
                    this.loadData();
                }
            });
    }

    loadData() {
        const subscription = this.auditLogService
            .getAuditLogs(this.auditLogParams)
            .subscribe({
                next: (response) => {
                    this.dataSource.data = response.items;
                    this.auditLogParams.totalCount = response.metadata.totalCount;
                },
            });

        this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }

    applyDateFilter() {
        const selectedDate = this.filterForm.value.date;
        this.auditLogParams.date = selectedDate
            ? this.datePipe.transform(selectedDate, 'yyyy-MM-dd')
            : null;
        this.auditLogParams.pageNumber = 1;
        if (this.paginator) {
            this.paginator.pageIndex = 0;
        }
        this.loadData();
    }

    clearDateFilter() {
        this.filterForm.reset({ date: null });
        this.auditLogParams.date = null;
        this.auditLogParams.pageNumber = 1;
        if (this.paginator) {
            this.paginator.pageIndex = 0;
        }
        this.loadData();
    }

    formatAction(action: string): string {
        switch (action) {
            case 'PrincipalRepayment':
                return 'Principal Repayment';
            case 'InterestRepayment':
                return 'Interest Repayment';
            case 'LateFeeRepayment':
                return 'Late Fee Repayment';
            case 'EodProcess':
                return 'EOD Process';
            default:
                return action;
        }
    }
}
