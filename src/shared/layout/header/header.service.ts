import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class HeaderService {
    private baseUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getBusinessDate() {
        return this.http.get<BusinessDate>(this.baseUrl + 'systemBusinessDates');
    }
}

export type BusinessDate = {
    id: string;
    businessDate: Date;
    lastUpdatedOn: Date;
}
