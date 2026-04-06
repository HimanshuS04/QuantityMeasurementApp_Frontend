import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-tabs.component.html',
  styleUrl: './action-tabs.component.scss'
})
export class ActionTabsComponent {
  @Input() selectedAction = 'Comparison';
  @Output() selectedActionChange = new EventEmitter<string>();

  actions = ['Comparison', 'Conversion', 'Arithmetic'];

  selectAction(action: string): void {
    this.selectedActionChange.emit(action);
  }
}