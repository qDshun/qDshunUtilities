import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { IdentityService } from "@services";
import { Observable, tap } from "rxjs";


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
