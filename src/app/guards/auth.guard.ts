import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const acessToken = localStorage.getItem('acessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (acessToken && refreshToken) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}