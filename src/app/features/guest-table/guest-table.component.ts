import {Component, Input} from '@angular/core';
import {Guest} from '../../model/guest.model';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-guest-table',
  imports: [
    NgForOf
  ],
  templateUrl: './guest-table.component.html',
  styleUrl: './guest-table.component.css'
})
export class GuestTableComponent {
  @Input() guests: Guest[] =[];

}
