import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterRequest, LoginRequest, TokenResponse } from '../models';
import { ApiService } from './api.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  private authPrefix = 'identity';
  private apiService = inject(ApiService);
  private router = inject(Router);
  private registerRoute = `${this.authPrefix}/register`;
  private loginRoute = `${this.authPrefix}/login?useCookies=true`;


  private isLoggedInName = 'IsLoggedIn';
  private isLoggedInValue = 'true';

  constructor() {
  }

  register(registerRequest: RegisterRequest) {
    return this.apiService.post(this.registerRoute, registerRequest);
  }

  login(loginRequest: LoginRequest, rememberMe: boolean) {
    return this.apiService.post<TokenResponse>(this.loginRoute, loginRequest).pipe(
      tap(() => this.rememberLogIn())
    );
  }

  get isLoggedIn(): boolean {
    const isLoggedIn = localStorage.getItem(this.isLoggedInName) ?? sessionStorage.getItem(this.isLoggedInName);
    return !!isLoggedIn;
  }

  rememberLogIn(){
    localStorage.setItem(this.isLoggedInName, this.isLoggedInValue);
    sessionStorage.setItem(this.isLoggedInName, this.isLoggedInValue);
  }

  logout() {
    localStorage.removeItem(this.isLoggedInName);
    sessionStorage.removeItem(this.isLoggedInName);
  }

  redirectToLogin(): Promise<boolean> {
    return this.router.navigateByUrl('/login', { skipLocationChange: false });
  }

  redirectToRegister(): Promise<boolean> {
    return this.router.navigateByUrl('/register', { skipLocationChange: false });
  }

  redirectToHome(): Promise<boolean> {
    return this.router.navigateByUrl('/', { skipLocationChange: false });
  }
}
