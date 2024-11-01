import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isActiveSubject = new BehaviorSubject<boolean>(false);
  isActive$ = this.isActiveSubject.asObservable();

  constructor() { }

  openModal() {
    this.isActiveSubject.next(true);
  }

  closeModal() {
    this.isActiveSubject.next(false);
  }
}
