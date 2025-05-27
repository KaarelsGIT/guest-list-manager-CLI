import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Guest} from '../models/guest.model';
import {GuestResponseDTO} from '../dto/guest-response.dto';
import {GuestListDto} from '../dto/guest-list.dto';


@Injectable({
  providedIn: 'root'
})
export class GuestService {

  private url = environment.apiURL + '/guests';

  constructor(
    private http: HttpClient
  ) { }

  addGuest(guest: Guest): Observable<GuestResponseDTO> {
    const payload = {
      name: guest.name,
      transportation: guest.transportation,
      status: guest.status
    };

    return this.http.post<GuestResponseDTO>(`${this.url}/add`, payload);
  }

  getAllGuests(sort: string = 'asc', filter: string = 'all'): Observable<GuestListDto> {
    const params = new HttpParams()
      .set('sort', sort)
      .set('filter', filter);

    return this.http.get<GuestListDto>(`${this.url}/all`, { params });
  }

  getGuestById(id: number): Observable<GuestResponseDTO> {
    return this.http.get<GuestResponseDTO>(`${this.url}/${id}`);
  }

  updateGuest(id: number, guest: Guest): Observable<GuestResponseDTO> {
    const payload = {
      name: guest.name,
      transportation: guest.transportation,
      status: guest.status
    };
    return this.http.put<GuestResponseDTO>(`${this.url}/update/${id}`, payload);
  }

  deleteGuest(id: number): Observable<string> {
    return this.http.delete(`${this.url}/delete/${id}`, { responseType: 'text' });
  }

  deleteAllGuests(): Observable<string> {
    return this.http.delete(`${this.url}/deleteAll`, { responseType: 'text' });
  }

}
