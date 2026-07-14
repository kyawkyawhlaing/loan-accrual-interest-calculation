import { Injectable, inject } from '@angular/core';
import {
    HubConnection,
    HubConnectionBuilder,
    HubConnectionState,
} from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpCacheService } from './http-cache.service';

@Injectable({ providedIn: 'root' })
export class SignalrService {
    private readonly httpCache = inject(HttpCacheService);
    private hubConnection?: HubConnection;
    private readonly refreshSubject = new Subject<string[]>();

    readonly refresh$ = this.refreshSubject.asObservable();

    async startConnection(): Promise<void> {
        if (
            this.hubConnection &&
            this.hubConnection.state !== HubConnectionState.Disconnected
        ) {
            return;
        }

        this.hubConnection = new HubConnectionBuilder()
            .withUrl(environment.hubUrl + 'data-refresh', {
                withCredentials: true,
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.on('DataRefresh', (tables: string[]) => {
            for (const table of tables ?? []) {
                this.httpCache.invalidate(table);
            }
            this.refreshSubject.next(tables ?? []);
        });

        await this.hubConnection.start();
    }

    async stopConnection(): Promise<void> {
        if (!this.hubConnection) {
            return;
        }

        await this.hubConnection.stop();
        this.hubConnection = undefined;
    }
}
