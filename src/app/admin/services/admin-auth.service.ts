import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

// Hardcoded credentials for local use only
// Change these to whatever you want
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'portfolio2024';
const SESSION_KEY = 'ng_portfolio_admin_auth';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private router = inject(Router);

  isAuthenticated = signal<boolean>(this.checkSession());

  private checkSession(): boolean {
    try {
      const session = sessionStorage.getItem(SESSION_KEY);
      return session === 'true';
    } catch {
      return false;
    }
  }

  login(username: string, password: string): boolean {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this.isAuthenticated.set(false);
    this.router.navigate(['/admin/login']);
  }

  requireAuth(): boolean {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/admin/login']);
      return false;
    }
    return true;
  }
}
