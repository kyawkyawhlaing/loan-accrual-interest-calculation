import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class UtilsService {

    public parseAmount(value: string): number {
        return Number(value.replace(/,/g, ''));
    }

    public parseUtcDate(value: string) {
        const now = new Date();

        const hh = now.getUTCHours().toString().padStart(2, '0');
        const mm = now.getUTCMinutes().toString().padStart(2, '0');
        const ss = now.getUTCSeconds().toString().padStart(2, '0');
        const utcDate = new Date(`${value}T${hh}:${mm}:${ss}Z`).toISOString();
        
        return utcDate;
    }
}
