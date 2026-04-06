import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-selector.component.html',
  styleUrl: './category-selector.component.scss'
})
export class CategorySelectorComponent {
  @Input() selectedCategory = 'Length';
  @Output() selectedCategoryChange = new EventEmitter<string>();

  categories = [
    { label: 'Length', icon: '📏' },
    { label: 'Weight', icon: '⚖️' },
    { label: 'Volume', icon: '🥛' },
    { label: 'Temperature', icon: '🌡️' }
  ];

  selectCategory(category: string): void {
    this.selectedCategoryChange.emit(category);
  }
}