import {Component, Input, OnInit} from '@angular/core';
import {Guest} from '../../models/guest.model';
import {NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {GuestService} from '../../services/guest.service';
import {
  ConfirmationDialogComponent
} from '../../../../shared/components/confirmation-dialog.component/confirmation-dialog.component';
import {MessageService} from '../../../../shared/components/service/message.service';
import {MessageModalComponent} from '../../../../shared/components/message-modal/message-modal.component';
import {AppMessage} from '../../../../shared/models/message.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-guest-table',
  imports: [
    NgForOf,
    MatButton,
    ConfirmationDialogComponent,
    NgIf,
    MessageModalComponent
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

  constructor(
    private guestService: GuestService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.messageSubscription = this.messageService.message$.subscribe(msg => {
      this.message = msg;
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

  edit(guest: Guest) {

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

  view(guest: Guest) {

  }

}
