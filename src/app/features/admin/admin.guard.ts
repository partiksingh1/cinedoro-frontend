import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role')?.toLowerCase();

  if (token && role === 'admin') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};