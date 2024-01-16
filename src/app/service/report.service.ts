import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private newReportSubject = new BehaviorSubject<boolean>(false);
  constructor() { }

  newReportAdded() {
    this.newReportSubject.next(true);
  }

  // Observable to subscribe to
  get newReportObservable() {
    return this.newReportSubject.asObservable();
  }
}
