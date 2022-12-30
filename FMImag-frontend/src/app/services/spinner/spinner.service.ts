import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  public showSpinner = new BehaviorSubject<boolean>(false);
  constructor() { }
  show() {
    setTimeout(() => {
      this.showSpinner.next(true);
    });
    
  }

  hide() {
    setTimeout(() => {
      this.showSpinner.next(false);
    });
  }
}
