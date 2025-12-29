import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class UtilsService {
    public parseAmount(value: string): number {
        return Number(value.replace(/,/g, ''));
    }
}
