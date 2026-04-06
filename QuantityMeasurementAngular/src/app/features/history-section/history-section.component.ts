import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../../core/services/history.service';
import { HistoryTableComponent } from '../../shared/components/history-table/history-table.component';
import { AdminHistoryPanelComponent } from '../admin-history-panel/admin-history-panel.component';

@Component({
  selector: 'app-history-section',
  standalone: true,
  imports: [CommonModule, HistoryTableComponent, AdminHistoryPanelComponent],
  templateUrl: './history-section.component.html',
  styleUrl: './history-section.component.scss'
})
export class HistorySectionComponent {
  @Input() isLoggedIn = false;
  @Input() isAdmin = false;

  myHistory: any[] = [];
  errorMessage = '';
  isLoading = false;

  constructor(
    private historyService: HistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  loadMyHistory(): void {
    if (this.isLoading) return;

    this.errorMessage = '';
    this.myHistory = [];
    this.isLoading = true;
    this.cdr.detectChanges();

    this.historyService.getMyHistory().subscribe({
      next: (response) => {
        this.myHistory = response || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = this.extractError(err, 'Failed to load history.');
        this.isLoading = false;
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