import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../environments/environment.development';
import { Repayment } from '../../../shared/types/repayment';

@Injectable({ providedIn: 'root' })
export class PrincipalService {
    private baseUrl = environment.apiUrl;
    private http = inject(HttpClient);

    createRepaymentVoucher(voucher: Repayment) {
        var apiPath = "";

        if (voucher.productCode.toLowerCase() == 'dcf') apiPath = this.baseUrl + 'principal/dcf/repayment';

        if (voucher.productCode.toLowerCase() == 'fcf') apiPath = this.baseUrl + 'principal/fcf/repayment';

        if (voucher.productCode.toLowerCase() == 'inf') apiPath = this.baseUrl + 'principal/inf/repayment';

        if (voucher.productCode.toLowerCase() == 'pef') apiPath = this.baseUrl + 'principal/pef/repayment';

        if (voucher.productCode.toLowerCase() == 'stf') apiPath = this.baseUrl + 'principal/stf/repayment';

        return this.http.post<string>(apiPath, voucher);
    }

    getLoanByAccountNumber(loanAcctNumber: string) {
        return this.http.get<any>(this.baseUrl + 'loan-accounts/' + loanAcctNumber);
    }
}
