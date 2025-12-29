import { inject, Injectable, signal } from "@angular/core";
import { User } from "../../shared/types/user";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.development";

@Injectable({ providedIn: 'root' })
export class AccountService {
    currentUser = signal<User | null>(null);
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;
}
