import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Repayment } from "../../../shared/types/repayment";

@Injectable({providedIn: 'root'})
export class InterestService {
    private baseUrl = environment.apiUrl;
    private http = inject(HttpClient);

    createRepaymentVoucher(voucher: Repayment) {
        return this.http.post<string>(this.baseUrl + 'interestRepayment/create', voucher);
    }

    getLoanByAccountNumber(loanAcctNumber: string) {
        return this.http.get<any>(this.baseUrl + 'principalRepayment/' + loanAcctNumber);
    }
}
