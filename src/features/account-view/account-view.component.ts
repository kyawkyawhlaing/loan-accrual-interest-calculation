import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../core/customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-account-view',
    imports: [MatCardModule, MatMenuModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatProgressBarModule, MatTooltipModule],
    templateUrl: 'account-view.component.html',
    styleUrl: 'account-view.component.scss',
})
export class AccountViewComponent {
    displayedColumns: string[] = ['id', 'loanAcctNum', 'loanAcctName', 'outsPrinAmt', 'ttlAccIntAmt', 'ttlAccPenalAmt', 'intRate', 'penalRate'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
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
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        id: '#158',
        loanAcctNum: 'DCF-001',
        loanAcctName: 'Apex, Ltd.',
        outsPrinAmt: 1000000,
        ccy: 'MMK',
        ttlAccIntAmt: 0,
        ttlAccPenalAmt: 0,
        intRate: 12,
        penalRate: 3
    },
    {
        id: '#159',
        loanAcctNum: 'FCF-001',
        loanAcctName: 'PUKA, Ltd.',
        outsPrinAmt: 1000000,
        ccy: 'MMK',
        ttlAccIntAmt: 0,
        ttlAccPenalAmt: 0,
        intRate: 12,
        penalRate: 3
    },
];

export interface PeriodicElement {
    id: string;
    loanAcctNum: string;
    loanAcctName: string;
    outsPrinAmt: number;
    ccy: string;
    ttlAccIntAmt: number;
    ttlAccPenalAmt: number;
    intRate: number;
    penalRate: number;
}
