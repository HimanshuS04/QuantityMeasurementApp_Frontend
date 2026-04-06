import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-auth-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-panel.component.html',
  styleUrl: './auth-panel.component.scss'
})
export class AuthPanelComponent {
  @Output() loginSuccess = new EventEmitter<{ email: string; role: string }>();
  @Output() closePanel = new EventEmitter<void>();

  loginEmail = '';
  loginPassword = '';

  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';

  message = '';
  messageType: 'error' | 'success' = 'success';
  isLoginLoading = false;
  isRegisterLoading = false;

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private cdr: ChangeDetectorRef
  ) {}

  onLogin(): void {
    if (this.isLoginLoading) return;

    this.message = '';

    if (!this.loginEmail || !this.loginPassword) {
      this.messageType = 'error';
      this.message = 'Enter email and password.';
      return;
    }

    this.isLoginLoading = true;
    this.cdr.detectChanges();

    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: (response) => {
        const token = response.token;
        const parsed = this.parseJwt(token);

        const email =
          response.email ||
          parsed?.email ||
          parsed?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
          this.loginEmail;

        const role =
          response.role ||
          parsed?.role ||
          parsed?.Role ||
          parsed?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
          'User';

        this.sessionService.setToken(token);
        this.sessionService.setEmail(email);
        this.sessionService.setRole(role);

        this.messageType = 'success';
        this.message = 'Login successful.';
        this.isLoginLoading = false;

        console.log('AUTH LOGIN RESPONSE:', response);
        console.log('PARSED JWT:', parsed);
        console.log('FINAL ROLE USED:', role);

        this.loginSuccess.emit({ email, role });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.messageType = 'error';
        this.message = this.extractError(err, 'Login failed.');
        this.isLoginLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onRegister(): void {
    if (this.isRegisterLoading) return;

    this.message = '';

    if (!this.registerEmail || !this.registerPassword || !this.registerConfirmPassword) {
      this.messageType = 'error';
      this.message = 'Fill all registration fields.';
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.messageType = 'error';
      this.message = 'Passwords do not match.';
      return;
    }

    this.isRegisterLoading = true;
    this.cdr.detectChanges();

    this.authService.register(this.registerEmail, this.registerPassword).subscribe({
      next: (response: any) => {
        this.messageType = 'success';
        this.message = typeof response === 'string' ? response : 'Registration successful.';
        this.isRegisterLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.messageType = 'error';
        this.message = this.extractError(err, 'Registration failed.');
        this.isRegisterLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private parseJwt(token: string): any | null {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  private extractError(err: any, fallback: string): string {
    if (!err) return fallback;
    if (typeof err.error === 'string') return err.error;
    if (err.error?.message) return err.error.message;
    if (err.message) return err.message;
    return fallback;
  }
}