import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  setToken(token: string): void {
    sessionStorage.setItem('qm_token', token);
  }

  getToken(): string {
    return sessionStorage.getItem('qm_token') || '';
  }

  setEmail(email: string): void {
    sessionStorage.setItem('qm_email', email);
  }

  getEmail(): string {
    return sessionStorage.getItem('qm_email') || '';
  }

  setRole(role: string): void {
    sessionStorage.setItem('qm_role', role);
  }

  getRole(): string {
    return sessionStorage.getItem('qm_role') || '';
  }

  clear(): void {
    sessionStorage.removeItem('qm_token');
    sessionStorage.removeItem('qm_email');
    sessionStorage.removeItem('qm_role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }
}