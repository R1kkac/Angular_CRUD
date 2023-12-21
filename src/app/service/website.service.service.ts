import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsiteServiceService {
  private dataSubject= new BehaviorSubject<boolean>(true);
  public data$= this.dataSubject.asObservable();

  constructor() { }
  isViewHeader(data : boolean){
    this.dataSubject.next(data);
  }
}
