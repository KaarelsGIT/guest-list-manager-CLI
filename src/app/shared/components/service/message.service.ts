import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {AppMessage} from '../../models/message.model';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private _message$ = new BehaviorSubject<AppMessage | null>(null);
  message$ = this._message$.asObservable();

  show(message: AppMessage) {
    this._message$.next(message);
  }

  clear() {
    this._message$.next(null);
  }
}
