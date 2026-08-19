import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class UtilsService {

    public parseAmount(value: string): number {
        return Number(value.replace(/,/g, ''));
    }

    public formatAmount(value: string): string {
        if (!value) return '-';
        const num = this.parseAmount(value);
        if (isNaN(num)) return '-';
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    public toUtcDate(value: Date) {
        const now = new Date();

        value.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

        return value.toISOString();
    }
}
