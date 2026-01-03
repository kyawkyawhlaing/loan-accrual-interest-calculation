import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class UtilsService {

    public parseAmount(value: string): number {
        return Number(value.replace(/,/g, ''));
    }

    public toUtcDate(value: Date) {
        const now = new Date();

        value.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

        return value.toISOString();
    }
}
