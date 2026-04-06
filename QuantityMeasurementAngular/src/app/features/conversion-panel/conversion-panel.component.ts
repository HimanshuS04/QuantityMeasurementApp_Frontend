import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuantityService } from '../../core/services/quantity.service';

@Component({
  selector: 'app-conversion-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversion-panel.component.html',
  styleUrl: './conversion-panel.component.scss'
})
export class ConversionPanelComponent implements OnChanges {
  @Input() category = 'Length';

  units: string[] = [];
  value: number = 0;
  fromUnit = '';
  toUnit = '';
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

  convert(): void {
    if (this.isLoading) return;

    this.result = '';
    this.errorMessage = '';
    this.isLoading = true;
    this.cdr.detectChanges();

    const quantity = {
      category: this.category,
      unit: this.fromUnit,
      value: Number(this.value)
    };

    this.quantityService.convert(quantity, this.toUnit).subscribe({
      next: (response) => {
        this.result = response?.result?.value?.toString() || '';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = this.extractError(err, 'Conversion failed.');
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
    this.fromUnit = this.units[0] || '';
    this.toUnit = this.units[1] || this.units[0] || '';
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