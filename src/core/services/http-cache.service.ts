import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpCacheService {
    private readonly cache = new Map<string, unknown>();

    get<T>(key: string): T | undefined {
        return this.cache.get(key) as T | undefined;
    }

    set(key: string, value: unknown): void {
        this.cache.set(key, value);
    }

    invalidate(urlPattern: string): void {
        for (const key of [...this.cache.keys()]) {
            if (key.includes(urlPattern)) {
                this.cache.delete(key);
            }
        }
    }

    clear(): void {
        this.cache.clear();
    }
}
