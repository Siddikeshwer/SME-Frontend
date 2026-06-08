// src/app/features/auth/unauthorized/unauthorized.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#F0F2F8">
      <mat-icon style="font-size:80px;width:80px;height:80px;color:#C22626">lock</mat-icon>
      <h1 style="color:#0E1630;margin:16px 0 8px">Access Denied</h1>
      <p style="color:#5C728C">You don't have permission to access this page.</p>
      <button mat-raised-button color="primary" (click)="goHome()">Go to Dashboard</button>
    </div>`
})
export class UnauthorizedComponent {
  constructor(private router: Router, private auth: AuthService) {}
  goHome(): void {
    this.router.navigate([this.auth.isAdmin() ? '/admin/dashboard' : '/poc/dashboard']);
  }
}
