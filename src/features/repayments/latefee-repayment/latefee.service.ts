import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Repayment } from "../../../shared/types/repayment";

@Injectable({providedIn: 'root'})
export class LatefeeService {
    private baseUrl = environment.apiUrl;
    private http = inject(HttpClient);

    createRepaymentVoucher(voucher: Repayment) {
        return this.http.post<string>(this.baseUrl + 'penaltyRepayment/create', voucher);
    }
}
