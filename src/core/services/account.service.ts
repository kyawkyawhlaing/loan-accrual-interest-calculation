import { inject, Injectable, signal } from "@angular/core";
import { User } from "../../shared/types/user";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { map, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AccountService {
    currentUser = signal<User | null>(null);
    username = signal<string>('');
    role = signal<string>('');

    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getUserInfo() {
        return this.http.get<UserInfoResponse>(this.baseUrl + 'user-info').pipe(
            map(user => ({
                id: user.id,
                displayName: user.username,
                role: user.role,
            } as User)),
            tap(user => this.setCurrentUser(user))
        );
    }

    setCurrentUser(user: User | null) {
        this.currentUser.set(user);
        this.username.set(user?.displayName ?? '');
        this.role.set(user?.role ?? '');
    }
}

type UserInfoResponse = {
    id: string;
    username: string;
    role: string;
};
