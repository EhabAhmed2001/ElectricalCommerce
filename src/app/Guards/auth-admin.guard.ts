import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if(authService.IsAdmin()){
    console.log(authService.IsAdmin());
      return true;
  }else{
    router.navigate(['/adminLogin']);
    return false;
  }
};
