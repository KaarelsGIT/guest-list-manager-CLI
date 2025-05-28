import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HeaderComponent} from './shared/components/header/header.component';
import {FooterComponent} from './shared/components/footer/footer.component';
import {GuestTableComponent} from './features/guest/components/guest-table/guest-table.component';
import {GuestService} from './features/guest/services/guest.service';
import {AddGuestComponent} from './features/guest/components/add-guest/add-guest.component';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    GuestTableComponent,
    FooterComponent,
    AddGuestComponent,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'GuestManagerCLI';
  guests: any[] = [];
  isFormVisible = false;
  acceptedCount: number = 0;

  @ViewChild('guestTable') guestTableComponent!: GuestTableComponent;
  onRemoveAllGuests() {
    this.guestTableComponent.confirmDeleteAllGuests();
  }

  constructor(private guestService: GuestService) { }

  ngOnInit(): void {
    this.loadGuests();
  }

  loadGuests(): void {
    this.guestService.getAllGuests().subscribe({
      next: (data) => {
        this.guests = data.guests;
        this.acceptedCount = data.accepted;
      },
      error: (err) => {
        console.error('Failed to load guests:', err);
      }
    });
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
  }

  onGuestAdded(): void {
    this.loadGuests();
  }
}
