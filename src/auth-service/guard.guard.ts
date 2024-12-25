import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';

export const guardGuard: CanActivateFn = (route, state) => {

  const authService = inject(LoginService);
  const router = inject(Router)

  if (authService.isAuthenticated()){
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};