import {AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
import {Subscription} from 'rxjs';
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
export class GuestTableComponent implements OnInit, AfterViewChecked {
  @Input() guests: Guest[] = [];
  @Output() onUpdate = new EventEmitter<void>();

  @ViewChild('nameInput') nameInputRef?: ElementRef<HTMLDivElement>;
  @ViewChild('commentInput') commentInputRef?: ElementRef<HTMLDivElement>;

  message: AppMessage | null = null;
  private messageSubscription?: Subscription;
  showConfirmDialog = false;
  guestToDelete?: number;

  editingGuest: Guest | null = null;
  editingField: 'name' | 'comment' | null = null;
  editedValue = '';

  constructor(
    private guestService: GuestService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.messageSubscription = this.messageService.message$.subscribe(msg => {
      this.message = msg;
    });
  }

  ngAfterViewChecked(): void {
    if (!this.editingGuest || !this.editingField) return;

    const ref = this.editingField === 'name' ? this.nameInputRef : this.commentInputRef;
    if (ref) {
      const el = ref.nativeElement;
      el.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }

  startEdit(guest: Guest, field: 'name' | 'comment'): void {
    this.editingGuest = guest;
    this.editingField = field;
    this.editedValue = field === 'name' ? guest.name : guest.comment;
  }

  cancelEdit(): void {
    this.editingGuest = null;
    this.editingField = null;
    this.editedValue = '';
  }

  saveEditFromContent(event: Event): void {
    if (!this.editingGuest || !this.editingField) return;

    const element = event.target as HTMLElement;
    const newValue = element.textContent?.trim() || '';
    const field = this.editingField;

    if ((field === 'name' && newValue === this.editingGuest.name) ||
      (field === 'comment' && newValue === this.editingGuest.comment)) {
      this.cancelEdit();
      return;
    }

    if (field === 'name') this.editingGuest.name = newValue;
    if (field === 'comment') this.editingGuest.comment = newValue;

    this.guestService.updateGuest(this.editingGuest.id, this.editingGuest).subscribe({
      next: () => {
        this.messageService.show({
          type: 'success',
          text: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully.`,
          modal: true,
          duration: 1000
        });
        this.onUpdate.emit();
      },
      error: () => {
        this.messageService.show({
          type: 'error',
          text: `Failed to update ${field}.`,
          modal: true,
          duration: 1000
        });
      }
    });

    this.cancelEdit();
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'PENDING';
      case 'ACCEPTED':
        return 'ACCEPTED';
      case 'REJECTED':
        return 'REJECTED';
      default:
        return 'UNKNOWN';
    }
  }

  toggleTransportation(guest: Guest): void {
    guest.transportation = !guest.transportation;
    this.guestService.updateGuest(guest.id, guest).subscribe({
      next: () => console.log('Transportation status updated'),
      error: (err) => console.error('Failed to update transportation status', err)
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
        console.log('Status updated');
        this.onUpdate.emit();
      },
      error: (err) => console.error('Failed to update status', err)
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

  performDelete(): void {
    const isDeletingAll = this.guestToDelete === undefined;

    const deleteCall = isDeletingAll
      ? this.guestService.deleteAllGuests()
      : this.guestService.deleteGuest(this.guestToDelete!);

    deleteCall.subscribe({
      next: () => {
        this.guests = isDeletingAll
          ? []
          : this.guests.filter(g => g.id !== this.guestToDelete);
        this.cancelDelete();
        this.messageService.show({
          type: 'success',
          text: isDeletingAll ? 'All guests deleted successfully.' : 'Guest deleted successfully.',
          modal: true,
          duration: 1000
        });
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.cancelDelete();
        this.messageService.show({
          type: 'error',
          text: isDeletingAll ? 'Failed to delete all guests.' : 'Failed to delete guest.',
          modal: true,
          duration: 1000
        });
      }
    });
  }

  confirmDeleteAllGuests(): void {
    this.guestToDelete = undefined;
    this.showConfirmDialog = true;
  }

  getTransportationClass(transportation: boolean): string {
    return transportation ? 'status-needed' : 'status-not-needed';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACCEPTED':
        return 'status-accepted';
      case 'PENDING':
        return 'status-pending';
      case 'REJECTED':
        return 'status-rejected';
      default:
        return '';
    }
  }

  closeMessage(): void {
    this.messageService.clear();
  }
}
