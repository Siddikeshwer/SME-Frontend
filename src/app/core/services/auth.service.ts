// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/auth/login`, req).pipe(
      tap(res => {
        localStorage.setItem('auth_token', res.token);
        localStorage.setItem('auth_user', JSON.stringify(res));
        this.currentUserSubject.next(res);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null { return localStorage.getItem('auth_token'); }
  getCurrentUser(): AuthResponse | null { return this.currentUserSubject.value; }
  isLoggedIn(): boolean { return !!this.getToken(); }
  getRole(): string { return this.currentUserSubject.value?.role ?? ''; }
  isAdmin(): boolean { return this.getRole() === 'ADMIN'; }
  isPoc(): boolean   { return this.getRole() === 'POC'; }

  private loadUser(): AuthResponse | null {
    const u = localStorage.getItem('auth_user');
    return u ? JSON.parse(u) : null;
  }
}
