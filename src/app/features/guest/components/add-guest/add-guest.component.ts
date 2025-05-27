import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {Guest} from '../../models/guest.model';
import {Status} from '../../models/status.enum';
import {GuestService} from '../../services/guest.service';

@Component({
  selector: 'app-add-guest',
  imports: [
    FormsModule,
    NgForOf

  ],
  templateUrl: './add-guest.component.html',
  styleUrl: './add-guest.component.css'
})
export class AddGuestComponent {
  @Output() guestAdded = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  guest: Partial<Guest> = {
    name: '',
    status: Status.PENDING,
    transportation: false
  };

  statuses = [
    { label: 'Pending', value: Status.PENDING },
    { label: 'Accepted', value: Status.ACCEPTED },
    { label: 'Rejected', value: Status.REJECTED }
  ];

  constructor(
    private guestService: GuestService
  ) { }

  addGuest() {
    if (!this.guest.name || !this.guest.status) return;

    this.guestService.addGuest(this.guest as Guest).subscribe({
      next: (response) => {
        console.log('Guest added:', response);
        this.guest = { name: '', status: Status.PENDING, transportation: false };
        this.guestAdded.emit();
      },
      error: (err) => {
        console.error('Error adding guest', err);
      }
    });
  }

  cancel() {
    this.cancelled.emit();
  }
}
