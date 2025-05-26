import {Guest} from '../models/guest.model';

export interface GuestListDto {
  guests: Guest[];
  accepted: number;
}
