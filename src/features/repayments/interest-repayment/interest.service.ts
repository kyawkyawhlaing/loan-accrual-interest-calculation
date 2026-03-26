import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Repayment } from "../../../shared/types/repayment";

@Injectable({providedIn: 'root'})
export class InterestService {
    private baseUrl = environment.apiUrl;
    private http = inject(HttpClient);

    createRepaymentVoucher(voucher: Repayment) {
        var apiPath = "";

        if (voucher.productCode.toLowerCase() == 'dcf') apiPath = this.baseUrl + 'interest/dcf/repayment';

        if (voucher.productCode.toLowerCase() == 'fcf') apiPath = this.baseUrl + 'interest/fcf/repayment';

        if (voucher.productCode.toLowerCase() == 'inf') apiPath = this.baseUrl + 'interest/inf/repayment';

        if (voucher.productCode.toLowerCase() == 'pef') apiPath = this.baseUrl + 'interest/pef/repayment';

        if (voucher.productCode.toLowerCase() == 'stf') apiPath = this.baseUrl + 'interest/stf/repayment';

        return this.http.post<string>(apiPath, voucher);
    }

    getLoanByAccountNumber(loanAcctNumber: string) {
        return this.http.get<any>(this.baseUrl + 'loan-accounts/' + loanAcctNumber);
    }
}
