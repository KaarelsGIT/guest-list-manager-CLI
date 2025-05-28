import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
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
export class AddGuestComponent implements AfterViewInit {
  @Output() guestAdded = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild('nameInput') nameInputRef?: ElementRef<HTMLInputElement>;

  guest: Partial<Guest> = {
    name: '',
    status: Status.PENDING,
    transportation: false,
    comment: ''
  };

  statuses = [
    { label: 'Pending', value: Status.PENDING },
    { label: 'Accepted', value: Status.ACCEPTED },
    { label: 'Rejected', value: Status.REJECTED }
  ];

  constructor(private guestService: GuestService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.nameInputRef?.nativeElement.focus();
    });
  }

  addGuest(): void {
    if (!this.guest.name?.trim() || !this.guest.status) return;

    this.guestService.addGuest(this.guest as Guest).subscribe({
      next: () => {
        this.guest = {
          name: '',
          status: Status.PENDING,
          transportation: false,
          comment: ''
        };
        this.guestAdded.emit();
        setTimeout(() => {
          this.nameInputRef?.nativeElement.focus();
        });
      },
      error: (err) => {
        console.error('Error adding guest:', err);
      }
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
