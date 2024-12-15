import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../globals';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorklogService {
  private apiUrl = `${environment.apiUrl}/api`;
  constructor(private http: HttpClient,private globals:Globals) { }
 
   // get current user
   getWorkLogsByDate(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/WorkTrackings/GetWorkLogsByDate`);
  }

}
