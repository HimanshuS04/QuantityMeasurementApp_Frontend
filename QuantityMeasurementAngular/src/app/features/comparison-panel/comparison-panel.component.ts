import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuantityService } from '../../core/services/quantity.service';

@Component({
  selector: 'app-comparison-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comparison-panel.component.html',
  styleUrl: './comparison-panel.component.scss'
})
export class ComparisonPanelComponent implements OnChanges {
  @Input() category = 'Length';

  units: string[] = [];
  firstValue: number = 0;
  secondValue: number = 0;
  firstUnit = '';
  secondUnit = '';
  result = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private quantityService: QuantityService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    this.refreshUnits();
    this.clearState();
  }

  compare(): void {
    if (this.isLoading) return;

    this.result = '';
    this.errorMessage = '';
    this.isLoading = true;
    this.cdr.detectChanges();

    const first = {
      category: this.category,
      unit: this.firstUnit,
      value: Number(this.firstValue)
    };

    const second = {
      category: this.category,
      unit: this.secondUnit,
      value: Number(this.secondValue)
    };

    this.quantityService.compare(first, second).subscribe({
      next: (response) => {
        this.result = response?.equal ? 'True' : 'False';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = this.extractError(err, 'Comparison failed.');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private clearState(): void {
    this.result = '';
    this.errorMessage = '';
    this.isLoading = false;
  }

  private refreshUnits(): void {
    this.units = this.getUnits(this.category);
    this.firstUnit = this.units[0] || '';
    this.secondUnit = this.units[0] || '';
  }

  private getUnits(category: string): string[] {
    switch (category) {
      case 'Length': return ['feet', 'inch', 'yard', 'centimeter'];
      case 'Weight': return ['kilogram', 'gram', 'pound'];
      case 'Volume': return ['litre', 'millilitre', 'gallon'];
      case 'Temperature': return ['celsius', 'fahrenheit', 'kelvin'];
      default: return [];
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