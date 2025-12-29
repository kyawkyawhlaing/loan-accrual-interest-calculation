import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment.development";

type EodDate = {
    eodDate: Date
}

@Injectable({providedIn: 'root'})
export class EodService {
    isLoading = signal(false);

    private baseUrl = environment.apiUrl;
    private http = inject(HttpClient);


    processEod(eodDate: EodDate) {
        return this.http.post<any>(this.baseUrl + 'DailyAccrual/daily-accrual-job/', eodDate);
    }
}
