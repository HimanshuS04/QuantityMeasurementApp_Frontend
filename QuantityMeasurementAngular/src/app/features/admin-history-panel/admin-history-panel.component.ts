import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoryService } from '../../core/services/history.service';
import { HistoryTableComponent } from '../../shared/components/history-table/history-table.component';

@Component({
  selector: 'app-admin-history-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, HistoryTableComponent],
  templateUrl: './admin-history-panel.component.html',
  styleUrl: './admin-history-panel.component.scss'
})
export class AdminHistoryPanelComponent {
  userId: number | null = null;
  operations: any[] = [];
  errorMessage = '';
  isLoading = false;

  constructor(
    private historyService: HistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  loadHistory(): void {
    if (this.isLoading) return;

    this.errorMessage = '';
    this.operations = [];

    if (!this.userId) {
      this.errorMessage = 'Enter a valid user ID.';
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    this.historyService.getUserHistory(this.userId).subscribe({
      next: (response) => {
        this.operations = response || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = this.extractError(err, 'Failed to load user history.');
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