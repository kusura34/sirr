import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';
import { map, switchMap, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authReady$.pipe(
    take(1),
    switchMap(() => authService.user$.pipe(take(1))),
    map((user) => {
      if (user) {
        if (user.emailVerified) {
          return true; // Почта подтверждена, входим
        } else {
          alert('Пожалуйста, подтвердите вашу почту. Письмо уже отправлено!');
          return router.createUrlTree(['/auth']);
        }
      }
      return router.createUrlTree(['/auth']);
    })
  );
};