import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const resetPassword = localStorage.getItem('resetPassword');
    if (resetPassword === 'true') {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}