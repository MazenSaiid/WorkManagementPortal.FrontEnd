import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { ScreenShotValidationResponse } from '../../core/Models/Responses/ScreenShotValidationResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenshotsService {

  private apiUrl = `${environment.apiUrl}/api`; // Adjust base URL if needed

  constructor(private http: HttpClient) { }

   // Get all screenshots
  getScreenshotsForAllUsers(date: string): Observable<ScreenShotValidationResponse> {
    const params = new HttpParams().set('date', date); // Convert date to string
    return this.http.get<ScreenShotValidationResponse>(`${this.apiUrl}/ScreenShotTrackings/GetScreenshotsForAllUsers`, { params });
  }
    // Get all userscreenshots
  getScreenshotsForUser(date: string, userId: string): Observable<ScreenShotValidationResponse> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('date', date); // Convert date to string in correct format
    return this.http.get<ScreenShotValidationResponse>(`${this.apiUrl}/ScreenShotTrackings/GetScreenshotsForUser`, { params });
  }
  
}
