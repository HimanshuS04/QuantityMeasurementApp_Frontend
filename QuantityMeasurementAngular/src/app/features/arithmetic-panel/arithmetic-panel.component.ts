import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuantityService } from '../../core/services/quantity.service';

@Component({
  selector: 'app-arithmetic-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './arithmetic-panel.component.html',
  styleUrl: './arithmetic-panel.component.scss'
})
export class ArithmeticPanelComponent implements OnChanges {
  @Input() category = 'Length';

  units: string[] = [];
  operation = 'ADD';
  firstValue: number = 0;
  secondValue: number = 0;
  firstUnit = '';
  secondUnit = '';
  resultUnit = '';
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

  calculate(): void {
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

    if (this.operation === 'ADD') {
      this.quantityService.add(first, second, this.resultUnit).subscribe({
        next: (response) => {
          this.result = response?.result?.value?.toString() || '';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = this.extractError(err, 'Addition failed.');
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
      return;
    }

    if (this.operation === 'SUBTRACT') {
      this.quantityService.subtract(first, second, this.resultUnit).subscribe({
        next: (response) => {
          this.result = response?.result?.value?.toString() || '';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = this.extractError(err, 'Subtraction failed.');
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
      return;
    }

    this.quantityService.divide(first, second).subscribe({
      next: (response) => {
        this.result = response?.ratio?.toString() || '';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = this.extractError(err, 'Division failed.');
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
    this.resultUnit = this.units[0] || '';
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