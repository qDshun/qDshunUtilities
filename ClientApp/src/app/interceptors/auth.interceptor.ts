import { inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IdentityService } from '../services/identity.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private identityService = inject(IdentityService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const requestClone = request.clone({
      withCredentials: true
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
  }
}
