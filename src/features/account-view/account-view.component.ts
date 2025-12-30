import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../core/customizer-settings/customizer-settings.service';

import { AccountViewService } from './account-view.service';
import { LoanAccount, LoanAccountParams } from '../../shared/types/loan-account';

@Component({
    selector: 'app-account-view',
    imports: [MatCardModule, MatMenuModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatProgressBarModule, MatTooltipModule],
    templateUrl: 'account-view.component.html',
    styleUrl: 'account-view.component.scss',
})
export class AccountViewComponent {
    displayedColumns: string[] = ['id', 'loanAcctNum', 'loanAcctName', 'outsPrinAmt', 'ttlAccIntAmt', 'ttlAccPenalAmt', 'intRate', 'penalRate'];
    dataSource = new MatTableDataSource<LoanAccount>();

    private  destroyRef = inject(DestroyRef);
    private accountViewService = inject(AccountViewService);

    protected loanAccountParams = new LoanAccountParams();

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.loadData();

        this.paginator.page.subscribe(() => {
            this.loanAccountParams.pageNumber = this.paginator.pageIndex + 1;
            this.loanAccountParams.pageSize = this.paginator.pageSize;
            this.loadData();
        });
    }

    loadData() {
        const subscription = this.accountViewService
            .getAccounts(this.loanAccountParams)
            .subscribe({
                next: (response) => {
                    this.dataSource.data = response.items;
                    this.loanAccountParams.totalCount = response.metadata.totalCount;
                }
            });

        this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }

    constructor(
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    // isToggled
    isToggled = false;

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    // Search Filter
    applyFilter(event: Event) {
        event.stopPropagation();
        this.loanAccountParams.searchTerms = (event.target as HTMLInputElement).value.trim();
        this.loanAccountParams.pageNumber = 1;
        this.loadData();
    }

}

