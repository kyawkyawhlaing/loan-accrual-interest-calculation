import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment.development";
import { Repayment } from "../../../shared/types/repayment";

@Injectable({providedIn: 'root'})
export class PrincipalService {
    private baseUrl = environment.apiUrl;
    private http = inject(HttpClient);

    createRepaymentVoucher(voucher: Repayment) {
        return this.http.post<string>(this.baseUrl + 'principalRepayment/create', voucher);
    }
}
