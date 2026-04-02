import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from '../core/interceptors/error.interceptor';
import { loadingInterceptor } from '../core/interceptors/loading.interceptor';
import { firstValueFrom } from 'rxjs';
import { InitService } from '../core/services/init.service';
import { credentialsInterceptor } from '../core/interceptors/credentials.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideClientHydration(),
        provideAnimations(),
        provideHttpClient(withInterceptors([
            errorInterceptor,
            loadingInterceptor,
            credentialsInterceptor
        ])),
        provideAppInitializer(() => firstValueFrom(inject(InitService).init()))
    ],
};

