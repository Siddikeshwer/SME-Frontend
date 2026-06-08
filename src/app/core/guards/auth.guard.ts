// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    const requiredRoles: string[] = route.data['roles'] ?? [];
    if (requiredRoles.length && !requiredRoles.includes(this.auth.getRole())) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }
}
