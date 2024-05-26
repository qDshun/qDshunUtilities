import { Injectable, inject } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RegisterRequest, LoginRequest, TokenResponse } from '../models';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  private authPrefix = '';
  private tokenService = inject(TokenService);
  private apiService = inject(ApiService);
  private router = inject(Router);

  private registerRoute = `${this.authPrefix}/register`;
  private loginRoute = `${this.authPrefix}/login`;

  constructor() { }

  register(registerRequest: RegisterRequest) {
    return this.apiService.post(this.registerRoute, registerRequest);
  }

  login(loginRequest: LoginRequest, rememberMe: boolean) {
    return this.apiService.post<TokenResponse>(this.loginRoute, loginRequest)
      .pipe(
        tap(response => this.tokenService.setToken(response, rememberMe))
      );
  }

  get isLoggedIn(): boolean {
    return this.tokenService.getAccessToken() !== null;
  }

  getToken() {
    return this.tokenService.getAccessToken();
  }

  logout() {
    this.tokenService.removeToken();
  }

  redirectToLogin(): Promise<boolean> {
    return this.router.navigateByUrl(this.loginRoute, { skipLocationChange: false });
  }

  redirectToRegister(): Promise<boolean> {
    return this.router.navigateByUrl(this.registerRoute, { skipLocationChange: false });
  }

  redirectToHome(): Promise<boolean> {
    return this.router.navigateByUrl('/', { skipLocationChange: false });
  }

}
