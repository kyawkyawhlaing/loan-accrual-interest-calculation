import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../environments/environment.development';
import { Repayment } from '../../../shared/types/repayment';

@Injectable({ providedIn: 'root' })
export class PrincipalService {
    private baseUrl = environment.apiUrl;
    private http = inject(HttpClient);

    createRepaymentVoucher(voucher: Repayment) {
        return this.http.post<string>(this.baseUrl + 'principalRepayment/create', voucher);
    }

    getLoanByAccountNumber(loanAcctNumber: string) {
        return this.http.get<any>(this.baseUrl + 'principalRepayment/' + loanAcctNumber);
    }
}
