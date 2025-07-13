import {
  ApplicationConfig,
  APP_INITIALIZER,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  inject,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideHttpClient, withFetch } from '@angular/common/http';

import {
  OAuthModule,
  OAuthService,
  OAuthStorage,
  AuthConfig,
} from 'angular-oauth2-oidc';

const authConfig: AuthConfig = {
  issuer: 'https://demo.duendesoftware.com',
  redirectUri: window.location.origin,
  clientId: 'interactive.public',
  responseType: 'code',
  scope: 'openid profile email api',
  showDebugInformation: true,
};

async function setupOAuth() {
  const oauthService = inject(OAuthService);
  oauthService.configure(authConfig);
  oauthService.setupAutomaticSilentRefresh();

  console.log('Loading discovery document');
  await oauthService.loadDiscoveryDocumentAndTryLogin();
  console.log('Discovery document loaded');

  if (oauthService.hasValidAccessToken()) {
    console.log('User logged in');
    console.log('Access token:', oauthService.getAccessToken());
  } else {
    console.log('User not logged in');
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),

    importProvidersFrom(OAuthModule.forRoot()),

    {
      provide: OAuthStorage,
      useValue: sessionStorage,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => setupOAuth(),
      multi: true,
    },
  ],
};
