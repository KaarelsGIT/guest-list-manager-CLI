import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    MatButton,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() formVisible: boolean = false;
  @Output() addClicked = new EventEmitter<void>();
  @Output() removeClicked = new EventEmitter<void>();

  reloadPage(): void {
    window.location.reload();
  }

  add() {
    this.addClicked.emit();
  }

  deleteAllGuests() {
    this.removeClicked.emit();
  }
}
