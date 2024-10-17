import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { IdentityService } from "../services/identity.service";

export const authGuard = () => {
  const identityService = inject(IdentityService);
  const router = inject(Router);

  if (identityService.isLoggedIn) {
    return true;
  }

  // Redirect to the login page
  return router.parseUrl('/login');
};
