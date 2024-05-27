import { inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IdentityService } from '../services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private identityService = inject(IdentityService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.identityService.isLoggedIn) {
      const requestClone = request.clone({
        setHeaders: { Authorization: `Bearer: ${this.identityService.getToken()}` }
      });
      return next.handle(requestClone).pipe(
        tap({
          error: error => {
            if (error.status === 401) {
              this.identityService.logout();
              this.identityService.redirectToLogin();
            }
          }
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
