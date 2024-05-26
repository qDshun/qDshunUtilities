import { Injectable } from '@angular/core';
import { TokenResponse } from '@models/token-response.model';

const accessTokenName = 'accessToken';
const refreshTokenName = 'refreshToken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private accessToken = this.getTokenFromStorage(accessTokenName);

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setToken(tokenResponse: TokenResponse, rememberMe: boolean): void {
    this.accessToken = tokenResponse.accessToken;
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(accessTokenName, tokenResponse.accessToken);
    storage.setItem(refreshTokenName, tokenResponse.refreshToken);
  }

  removeToken(): void {
    this.accessToken = null;
    localStorage.removeItem(accessTokenName);
    sessionStorage.removeItem(refreshTokenName);
  }

  private getTokenFromStorage(tokenName: string): string | null  {
    return localStorage.getItem(tokenName) ?? sessionStorage.getItem(tokenName);
  }
}
