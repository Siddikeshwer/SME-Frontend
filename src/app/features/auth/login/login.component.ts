// src/app/features/auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  hidePassword = true;

  demoAccounts = [
    { label: 'Admin', email: 'admin@sme.com', password: 'password', color: '#2A70B2' },
    { label: 'POC',   email: 'priya@sme.com', password: 'password', color: '#12987A' },
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  fillDemo(account: any): void {
    this.form.patchValue({ email: account.email, password: account.password });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        const dest = res.role === 'ADMIN' ? '/admin/dashboard' : '/poc/dashboard';
        this.router.navigate([dest]);
      },
      error: (err) => {
        this.loading = false;
        this.snack.open(err.error?.error ?? 'Login failed. Check credentials.', 'Close', { duration: 4000 });
      }
    });
  }
}
