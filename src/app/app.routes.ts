import { Routes } from '@angular/router';
import { BlankPageComponent } from '../shared/blank-page/blank-page.component';
import { InterestComponent } from '../features/repayments/interest-repayment/interest.component';
import { LatefeeComponent } from '../features/repayments/latefee-repayment/latefee.component';
import { PrincipalComponent } from '../features/repayments/principal-repayment/principal.component';
import { RepaymentsComponent } from '../features/repayments/repayments.component';
import { InternalErrorComponent } from '../shared/error/internal-error/internal-error.component';
import { NotFoundComponent } from '../shared/error/not-found/not-found.component';
import { BackgroundServicesComponent } from '../features/background-services/background-services.component';
import { EodComponent } from '../features/background-services/eod/eod.component';
import { AccountViewComponent } from '../features/account-view/account-view.component';
import { IncomeAndSundryDetailsComponent } from '../features/reports/income-and-sundry-details/income-and-sundry-details.component';
import { OverdueFeeIncomeAndSundryDetailsComponent } from '../features/reports/overdue-fee-income-and-sundry-details/overdue-fee-income-and-sundry-details.component';
import { LoanPrincipleOverdueFeeSummaryComponent } from '../features/reports/loan-principle-overdue-fee-summary/loan-principle-overdue-fee-summary.component';
import { InterestSummaryComponent } from '../features/reports/interest-summary/interest-summary.component';




export const routes: Routes = [
    { path: '', component: AccountViewComponent },
    { path: 'account-view', component: AccountViewComponent },
    {
        path: 'report',
        children: [
            { path: 'income-and-sundry-details', component: IncomeAndSundryDetailsComponent },
            { path: 'overdue-fee-income-and-sundry-details', component: OverdueFeeIncomeAndSundryDetailsComponent },
            { path: 'loan-principle-overdue-fee-summary', component: LoanPrincipleOverdueFeeSummaryComponent},
            { path: 'interest-summary', component: InterestSummaryComponent}
        ]
    },
    {
        path: 'repayments',
        component: RepaymentsComponent,
        children: [
            {
                path: 'principal/create-principal',
                component: PrincipalComponent,
            },
            { path: 'interest/create-interest', component: InterestComponent },
            { path: 'latefee/create-latefee', component: LatefeeComponent },
        ],
    },
    {
        path: 'background-services',
        component: BackgroundServicesComponent,
        children: [{ path: 'eod/process-eod', component: EodComponent }],
    },
    { path: 'blank-page', component: BlankPageComponent },
    { path: 'internal-error', component: InternalErrorComponent },
    // Here add new pages component

    { path: '**', component: NotFoundComponent }, // This line will remain down from the whole pages component list
];
