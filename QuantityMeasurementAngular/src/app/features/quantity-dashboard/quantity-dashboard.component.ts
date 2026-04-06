import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategorySelectorComponent } from '../category-selector/category-selector.component';
import { ActionTabsComponent } from '../action-tabs/action-tabs.component';
import { ComparisonPanelComponent } from '../comparison-panel/comparison-panel.component';
import { ConversionPanelComponent } from '../conversion-panel/conversion-panel.component';
import { ArithmeticPanelComponent } from '../arithmetic-panel/arithmetic-panel.component';

@Component({
  selector: 'app-quantity-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CategorySelectorComponent,
    ActionTabsComponent,
    ComparisonPanelComponent,
    ConversionPanelComponent,
    ArithmeticPanelComponent
  ],
  templateUrl: './quantity-dashboard.component.html',
  styleUrl: './quantity-dashboard.component.scss'
})
export class QuantityDashboardComponent {
  selectedCategory = 'Length';
  selectedAction = 'Comparison';
}