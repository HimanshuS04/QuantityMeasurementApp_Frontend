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
        const email = response.email || this.loginEmail;
        const role = response.role || 'User';

        this.sessionService.setToken(response.token);
        this.sessionService.setEmail(email);
        this.sessionService.setRole(role);

        this.messageType = 'success';
        this.message = 'Login successful.';
        this.isLoginLoading = false;

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

  private extractError(err: any, fallback: string): string {
    if (!err) return fallback;
    if (typeof err.error === 'string') return err.error;
    if (err.error?.message) return err.error.message;
    if (err.message) return err.message;
    return fallback;
  }
}