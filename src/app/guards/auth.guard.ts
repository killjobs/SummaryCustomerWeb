import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.IsAuthenticate()){
    return true; // Permite acceso a la ruta
  }else{
    router.navigate(['/login']); //Redirige si no esta autenticado.
    return false;
  }
};

