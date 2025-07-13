import { Component, inject, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private oauth = inject(OAuthService);
  token = signal<string | null>(null);

  constructor() {
    this.token.set(this.oauth.getAccessToken());

    this.oauth.events.subscribe((event) => {
      if (event.type === 'token_received' || event.type === 'token_refreshed') {
        this.token.set(this.oauth.getAccessToken());
      }
    });
  }

  login() {
    this.oauth.initCodeFlow();
  }

  logout() {
    this.oauth.logOut();
    this.token.set(null);
  }
}
