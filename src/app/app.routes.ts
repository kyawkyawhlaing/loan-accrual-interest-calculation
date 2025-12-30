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




export const routes: Routes = [
    { path: 'account-view', component: AccountViewComponent },
    {
        path: 'repayments', component: RepaymentsComponent,
        children: [
            { path: 'principal/create-principal', component: PrincipalComponent },
            { path: 'interest/create-interest', component: InterestComponent },
            { path: 'latefee/create-latefee', component: LatefeeComponent },
        ]
    },
    {
        path: 'background-services', component: BackgroundServicesComponent,
        children: [
            { path: 'eod/process-eod', component: EodComponent },
        ]
    },
    { path: 'blank-page', component: BlankPageComponent },
    { path: 'internal-error', component: InternalErrorComponent },
    // Here add new pages component

    {path: '**', component: NotFoundComponent} // This line will remain down from the whole pages component list
];
