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

   // Create or update a workshift
   updateWorkShift(id: number, updateWorkShiftDto: any):Observable<WorkShiftValidationResponse> {
    return this.http.put<WorkShiftValidationResponse>(`${this.apiUrl}/WorkShifts/UpdateWorkShift/${id}`, updateWorkShiftDto);
  }
  // Create or update a workshift
  createWorkShift( createWorkShiftDto: any): Observable<WorkShiftValidationResponse> {
    return this.http.post<WorkShiftValidationResponse>(`${this.apiUrl}/WorkShifts/CreateWorkShift`, createWorkShiftDto);
  }
  // Delete a workshift
  deleteWorkShift(id: number): Observable<WorkShiftValidationResponse> {
    return this.http.delete<WorkShiftValidationResponse>(`${this.apiUrl}/WorkShifts/DeleteWorkShift/${id}`);
  }
}
