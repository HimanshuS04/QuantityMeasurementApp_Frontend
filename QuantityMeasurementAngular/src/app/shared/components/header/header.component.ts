import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() isLoggedIn = false;
  @Input() email = '';

  @Output() logoutClicked = new EventEmitter<void>();
  @Output() authClicked = new EventEmitter<void>();
}