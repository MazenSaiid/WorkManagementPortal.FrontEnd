import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';  // Make sure to import ToastrService

@Injectable({
  providedIn: 'root'
})
export class WorklogService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService  // Inject toastr service to show error notifications
  ) {}
  
  getWorkLogsByDate(userId: string, date: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('date', date);

    return this.http.get<any>(`${this.apiUrl}/WorkTrackings/GetWorkLogsByDate`, { params });
  }
  // Get Finished Work Logs by Date
  getFinishedWorkLogs(date: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/WorkTrackings/GetFinishedWorkLogs?date=${date}`);
  }

  // Get Paused Work Logs
  getPausedWorkLogs(date:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/WorkTrackings/GetPausedWorkLogs?date=${date}`);
  }

  // Get Active Work Logs
  getActiveWorkLogs(date:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/WorkTrackings/GetActiveWorkLogs?date=${date}`);
  }

  // Get Early Checkout WorkLogs
  getEarlyCheckoutWorkLogs(date:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/WorkTrackings/GetEarlyCheckoutWorkLogs?date=${date}`);
  }
  // Get Late Checkin WorkLogs
  getLateCheckinWorkLogs(date:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/WorkTrackings/GetLateCheckInWorkLogs?date=${date}`);
  }
}
