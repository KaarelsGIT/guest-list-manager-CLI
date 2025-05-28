import {Component, Input, OnInit} from '@angular/core';
import {Guest} from '../../models/guest.model';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {GuestService} from '../../services/guest.service';
import {
  ConfirmationDialogComponent
} from '../../../../shared/components/confirmation-dialog.component/confirmation-dialog.component';
import {MessageService} from '../../../../shared/components/service/message.service';
import {MessageModalComponent} from '../../../../shared/components/message-modal/message-modal.component';
import {AppMessage} from '../../../../shared/models/message.model';
import { Subscription } from 'rxjs';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-guest-table',
  imports: [
    NgForOf,
    MatButton,
    ConfirmationDialogComponent,
    NgIf,
    MessageModalComponent,
    FormsModule,
    NgClass
  ],
  templateUrl: './guest-table.component.html',
  styleUrl: './guest-table.component.css'
})
export class GuestTableComponent implements OnInit{
  @Input() guests: Guest[] =[];

  message: AppMessage | null = null;
  private messageSubscription?: Subscription;
  showConfirmDialog = false;
  guestToDelete?: number;
  editedGuest: Guest | null = null;
  editedName: string = '';

  // transportationOptions= [
  //   {value: true, label: 'Needed'},
  //   {value: false, label: 'Not needed'},
  // ]

  constructor(
    private guestService: GuestService,
    private messageService: MessageService
  ) { }

  startEditName(guest: Guest): void {
    this.editedGuest = guest;
    this.editedName = guest.name;
  }

  saveNameEdit(guest: Guest): void {
    if (!this.editedGuest) return;

    const trimmedName = this.editedName.trim();

    if (trimmedName !== guest.name) {
      guest.name = trimmedName;

      this.guestService.updateGuest(guest.id, guest).subscribe({
        next: () => {
          this.messageService.show({
            type: 'success',
            text: 'Name updated successfully.',
            modal: true,
            duration: 3000
          });
        },
        error: () => {
          this.messageService.show({
            type: 'error',
            text: 'Failed to update name.',
            modal: true,
            duration: 3000
          });
        }
      });
    }

    this.editedGuest = null;
    this.editedName = '';
  }

  cancelNameEdit(): void {
    this.editedGuest = null;
    this.editedName = '';
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'PENDING';
      case 'ACCEPTED': return 'ACCEPTED';
      case 'REJECTED': return 'REJECTED';
      default: return 'UNKNOWN';
    }
  }

  ngOnInit(): void {
    this.messageSubscription = this.messageService.message$.subscribe(msg => {
      this.message = msg;
    });
  }

  toggleTransportation(guest: Guest): void {
    guest.transportation = !guest.transportation;

    this.guestService.updateGuest(guest.id, guest).subscribe({
      next: () => {
        console.log('Transportation status updated successfully.');
      },
      error: (err) => {
        console.error('Failed to update transportation status:', err);
      }
    });
  }

  toggleStatus(guest: Guest): void {
    switch (guest.status) {
      case 'PENDING':
        guest.status = 'ACCEPTED';
        break;
      case 'ACCEPTED':
        guest.status = 'REJECTED';
        break;
      case 'REJECTED':
        guest.status = 'PENDING';
        break;
      default:
        guest.status = 'PENDING';
    }

    this.guestService.updateGuest(guest.id, guest).subscribe({
      next: () => {
        console.log('Status updated successfully');
      },
      error: (err) => {
        console.error('Failed to update status', err);
      }
    });
  }

  confirmDelete(guestId: number): void {
    this.guestToDelete = guestId;
    this.showConfirmDialog = true;
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.guestToDelete = undefined;
  }

  closeMessage() {
    this.messageService.clear();
  }

  performDelete(): void {
    if (this.guestToDelete === undefined) return;

    this.guestService.deleteGuest(this.guestToDelete).subscribe({
      next: () => {
        this.guests = this.guests.filter(g => g.id !== this.guestToDelete);
        this.cancelDelete();

        this.messageService.show({
          type: 'success',
          text: 'Guest deleted successfully.',
          modal: true,
          duration: 3000
        });
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.cancelDelete();

        this.messageService.show({
          type: 'error',
          text: 'Failed to delete guest.',
          modal: true,
          duration: 3000
        });
      }
    });
  }

  getTransportationClass(transportation: boolean): string {
    return transportation ? 'status-needed' : 'status-not-needed';
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'ACCEPTED': return 'status-accepted';
      case 'PENDING': return 'status-pending';
      case 'REJECTED': return 'status-rejected';
      default: return '';
    }
  }
}
