import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Repayment } from "../../../shared/types/repayment";

@Injectable({providedIn: 'root'})
export class LatefeeService {
    private baseUrl = environment.apiUrl;
    private http = inject(HttpClient);

    createRepaymentVoucher(voucher: Repayment) {
        var apiPath = "";

        if (voucher.productCode.toLowerCase() == 'dcf') apiPath = this.baseUrl + 'latefee/dcf/repayment';

        if (voucher.productCode.toLowerCase() == 'fcf') apiPath = this.baseUrl + 'latefee/fcf/repayment';

        if (voucher.productCode.toLowerCase() == 'inf') apiPath = this.baseUrl + 'latefee/inf/repayment';

        if (voucher.productCode.toLowerCase() == 'pef') apiPath = this.baseUrl + 'latefee/pef/repayment';

        if (voucher.productCode.toLowerCase() == 'stf') apiPath = this.baseUrl + 'latefee/stf/repayment';

        return this.http.post<string>(apiPath, voucher);
    }

    getLoanByAccountNumber(loanAcctNumber: string) {
        return this.http.get<any>(this.baseUrl + 'loan-accounts/' + loanAcctNumber);
    }
}
