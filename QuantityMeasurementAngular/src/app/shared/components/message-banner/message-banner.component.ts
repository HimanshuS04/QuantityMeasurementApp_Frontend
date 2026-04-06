import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-banner.component.html',
  styleUrl: './message-banner.component.scss'
})
export class MessageBannerComponent {
  @Input() message = '';
  @Input() type: 'error' | 'success' | 'info' = 'info';
}