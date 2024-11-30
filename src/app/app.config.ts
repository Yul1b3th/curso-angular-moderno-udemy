import { registerLocaleData } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { SpinnerInterceptor } from '@shared/interceptors/spinner.interceptor';
import { provideToastr } from 'ngx-toastr';
import { appRoutes } from './app.routes';

registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    { provide: LOCALE_ID, useValue: 'es' },
    provideHttpClient(withFetch(), withInterceptors([SpinnerInterceptor])),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
      timeOut: 1500,
      preventDuplicates: false,
    }),
    provideRouter(appRoutes),
  ],
};
