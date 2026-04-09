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

    logoutUser() {
        	var cookies = document.cookie.split(";");

			cookies.forEach(cookie => {
				var name = cookie.indexOf("=") > -1 ? cookie.substr(0, cookie.indexOf("=")) : cookie;
				console.log('Cookie Name: ', name)
				document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
			});

			const result = confirm('Are you sure you want to log out?');

			if (result) {
                this.http
                    .post(this.baseUrl + 'logout', {})
                    .subscribe(() => {
                        this.setCurrentUser(null);
                    });

				localStorage.clear();

				sessionStorage.clear();

				setTimeout(() => window.close(), 2000);
			} else {
				console.info('logout cancel');
			}

    }
}

type UserInfoResponse = {
    id: string;
    username: string;
    role: string;
};
