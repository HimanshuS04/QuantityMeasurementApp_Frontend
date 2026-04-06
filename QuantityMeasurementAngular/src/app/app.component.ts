import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthPanelComponent } from './features/auth-panel/auth-panel.component';
import { QuantityDashboardComponent } from './features/quantity-dashboard/quantity-dashboard.component';
import { HistorySectionComponent } from './features/history-section/history-section.component';
import { SessionService } from './core/services/session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    AuthPanelComponent,
    QuantityDashboardComponent,
    HistorySectionComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  userEmail = '';
  isAdmin = false;

  showAuthPanel = false;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.restoreSession();
  }

  handleLogin(event: { email: string; role: string }): void {
    this.isLoggedIn = true;
    this.userEmail = event.email;
    this.isAdmin = event.role === 'Admin';
    this.showAuthPanel = false;
  }

  handleLogout(): void {
    this.sessionService.clear();
    this.isLoggedIn = false;
    this.userEmail = '';
    this.isAdmin = false;
    this.showAuthPanel = false;
  }

  openAuthPanel(): void {
    this.showAuthPanel = true;
  }

  closeAuthPanel(): void {
    this.showAuthPanel = false;
  }

  private restoreSession(): void {
    this.isLoggedIn = this.sessionService.isLoggedIn();
    this.userEmail = this.sessionService.getEmail();
    this.isAdmin = this.sessionService.isAdmin();
  }
}