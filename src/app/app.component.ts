import {Component, OnInit} from '@angular/core';
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
    GuestTableComponent,
    AddGuestComponent,
    MatButton,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'GuestManagerCLI';
  guests: any[] = [];
  isFormVisible = false;

  constructor(private guestService: GuestService) { }

  ngOnInit(): void {
    this.loadGuests();
  }

  loadGuests(): void {
    this.guestService.getAllGuests().subscribe({
      next: (data) => {
        this.guests = data.guests;
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
