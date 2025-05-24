import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AppMessage} from '../../../model/message.model';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-message-modal',
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './message-modal.component.html',
  styleUrl: './message-modal.component.css'
})
export class MessageModalComponent {
  @Input() message!: AppMessage;
  @Output() closed = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.message?.duration) {
      setTimeout(() => {
        this.closed.emit();
      }, this.message.duration);
    }
  }

  close(): void {
    this.closed.emit();
  }
}
