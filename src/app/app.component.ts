import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './shared/components/header/header.component';
import {GuestTableComponent} from './features/guest-table/guest-table.component';
import {GuestService} from './core/services/guest.service';
import {FooterComponent} from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, GuestTableComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'GuestManagerCLI';
  guests: any[] = [];

  constructor(
    private guestService: GuestService
  ) { }

  ngOnInit(): void {
    this.loadGuests()
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
}
