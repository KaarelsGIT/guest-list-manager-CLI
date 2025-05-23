import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Guest} from '../model/guest.model';
import {GuestResponseDTO} from '../dto/guest-response.dto';


@Injectable({
  providedIn: 'root'
})
export class GuestService {

  private url = environment.apiURL + '/guests';

  constructor(
    private http: HttpClient
  ) {
  }

  addGuest(guest: Guest): Observable<GuestResponseDTO> {
    const payload = {
      name: guest.name,
      transportation: guest.transportation,
      status: guest.status
    };

    return this.http.post<GuestResponseDTO>(this.url, payload);
  }

}
