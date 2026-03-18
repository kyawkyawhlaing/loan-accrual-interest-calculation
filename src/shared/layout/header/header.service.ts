import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, map, tap } from "rxjs";

@Injectable({providedIn: 'root'})
export class HeaderService {
    private baseUrl = environment.apiUrl;
    private http = inject(HttpClient);
    private businessDateSubject = new BehaviorSubject<Date | null>(null);

    businessDate$ = this.businessDateSubject.asObservable();
    
    getBusinessDate() {
        const params = new HttpParams().set('_', Date.now());

        return this.http.get<BusinessDateResponse>(this.baseUrl + 'systemBusinessDates', { params }).pipe(
            map((data) => ({
                ...data,
                businessDate: new Date(data.businessDate),
                lastUpdatedOn: new Date(data.lastUpdatedOn),
            })),
            tap((data) => {
                this.businessDateSubject.next(data.businessDate);
            })
        );
    }

    setBusinessDate(date: Date | null) {
        this.businessDateSubject.next(date);
    }
}

export type BusinessDate = {
    id: string;
    businessDate: Date;
    lastUpdatedOn: Date;
}

type BusinessDateResponse = {
    id: string;
    businessDate: string;
    lastUpdatedOn: string;
}
