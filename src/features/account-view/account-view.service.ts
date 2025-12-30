import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { environment } from "../../environments/environment.development";

import { PaginatedResult } from "../../shared/types/pagination";
import { LoanAccountParams, LoanAccount } from "../../shared/types/loan-account";

@Injectable({providedIn: 'root'})
export class AccountViewService {
    private baseUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getAccounts(loanAccountParams: LoanAccountParams) {
        console.log('Params => ', loanAccountParams.searchTerms)
        let params = new HttpParams();
        params = params.append('pageNumber', loanAccountParams.pageNumber);
        params = params.append('pageSize', loanAccountParams.pageSize);
        params = params.append('searchTerms', loanAccountParams.searchTerms);

        return this.http.get<PaginatedResult<LoanAccount>>(this.baseUrl + 'loanAccounts/accounts', {params});
    }
}
