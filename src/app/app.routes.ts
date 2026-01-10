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
import { LoanPrincipalOverdueFeeSummaryComponent } from '../features/reports/loan-principal-overdue-fee-summary/loan-principal-overdue-fee-summary.component';
import { InterestSummaryComponent } from '../features/reports/interest-summary/interest-summary.component';
import { InterestDetailComponent } from '../features/reports/interest-detail/interest-detail.component';
import { LoanPrincipalOverdueFeeDetailComponent } from '../features/reports/loan-principal-overdue-fee-detail/loan-principal-overdue-fee-detail.component';
import { IndividualLoanAccountInterestDetailComponent } from '../features/reports/individual-loan-account-interest-detail/individual-loan-account-interest-detail.component';
import { IndividualLoanPrincipalOverdueFeeDetailComponent } from '../features/reports/individual-loan-principal-overdue-fee-detail/individual-loan-principal-overdue-fee-detail.component';
import { AccruedInterestReceivableSTFComponent } from '../features/reports/accrued-interest-receivable-stf/accrued-interest-receivable-stf.component';
import { TemporaryInterestSTFComponent } from '../features/reports/temporary-interest-stf/temporary-interest-stf.component';




export const routes: Routes = [
    { path: '', component: AccountViewComponent },
    { path: 'account-view', component: AccountViewComponent },
    {
        path: 'report',
        children: [
            { path: 'accrued-interest-receivable-stf', component: AccruedInterestReceivableSTFComponent},
            { path: 'temporary-interest-stf', component: TemporaryInterestSTFComponent},
            { path: 'income-and-sundry-details', component: IncomeAndSundryDetailsComponent },
            { path: 'overdue-fee-income-and-sundry-details', component: OverdueFeeIncomeAndSundryDetailsComponent },
            { path: 'app-loan-principal-overdue-fee-summary', component: LoanPrincipalOverdueFeeSummaryComponent},
            { path: 'loan-principal-overdue-fee-detail', component: LoanPrincipalOverdueFeeDetailComponent},
            { path: 'interest-summary', component: InterestSummaryComponent},
            { path: 'interest-detail', component: InterestDetailComponent},
            { path: 'individual-loan-account-interest-detail', component: IndividualLoanAccountInterestDetailComponent},
            { path: 'individual-loan-principal-overdue-fee-detail', component: IndividualLoanPrincipalOverdueFeeDetailComponent},
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
