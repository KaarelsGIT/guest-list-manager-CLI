import {Guest} from '../model/guest.model';

export interface GuestListDto {
  guests: Guest[];
  accepted: number;
}
