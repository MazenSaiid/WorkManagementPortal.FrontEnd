import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkShiftValidationResponse } from '../../core/Models/Responses/WorkShiftValidationResponse';

@Injectable({
  providedIn: 'root'
})
export class WorkShiftService {
  

  private apiUrl = `${environment.apiUrl}/api`; // Adjust base URL if needed

  constructor(private http: HttpClient) { }
 
  getAllWorkShifts(): Observable<WorkShiftValidationResponse> {
    return this.http.get<WorkShiftValidationResponse>(`${this.apiUrl}/WorkShifts/GetAllWorkShifts`);
  }
  
  getShiftTypes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/WorkShifts/GetShiftTypes`);
  }
  getDaysOfTheWeek() {
    return this.http.get<any>(`${this.apiUrl}/WorkShifts/GetDaysofTheWeek`);
  }
   updateWorkShift(id: number, updateWorkShiftDto: any):Observable<WorkShiftValidationResponse> {
    return this.http.put<WorkShiftValidationResponse>(`${this.apiUrl}/WorkShifts/UpdateWorkShift/${id}`, updateWorkShiftDto);
  }
  createWorkShift( createWorkShiftDto: any): Observable<WorkShiftValidationResponse> {
    return this.http.post<WorkShiftValidationResponse>(`${this.apiUrl}/WorkShifts/CreateWorkShift`, createWorkShiftDto);
  }
  deleteWorkShift(id: number): Observable<WorkShiftValidationResponse> {
    return this.http.delete<WorkShiftValidationResponse>(`${this.apiUrl}/WorkShifts/DeleteWorkShift/${id}`);
  }
}
