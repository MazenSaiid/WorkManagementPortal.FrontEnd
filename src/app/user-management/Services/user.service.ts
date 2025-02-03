import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs'; // Assuming you have your environment defined
import { environment } from '../../environment/environment';
import { UserValidationResponse, ValidationResponse } from '../../core/Models/Responses/UserValidationResponse';
import { UpdateUserDto } from '../../core/Models/Dtos/UpdateUserDto';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api`; // Adjust base URL if needed

  constructor(private http: HttpClient) { }

  // Get all users
  getAllUsers(): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(`${this.apiUrl}/Users/GetAllUsers`);
  }
  getAllAbsentUsers(date:string): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(`${this.apiUrl}/Users/AbsentUsers?date=${date}`);
  }
  // Get all users Included Supervisors And TeamLeads
  getAllEmployeesWithSupervisorsAndTeamLeads(): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(`${this.apiUrl}/Users/EmployeesWithSupervisorsAndTeamLeads`);
  }
  getUserById(id: string): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(`${this.apiUrl}/Users/GetUserById/${id}`);
  }
  getAllSupervisors(): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(`${this.apiUrl}/Users/Supervisors`);
  }

  // Get all team leaders
  getAllTeamLeaders(): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(`${this.apiUrl}/Users/TeamLeaders`);
  }

  // Get all employees
  getAllEmployees(): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(`${this.apiUrl}/Users/Employees`);
  }

  // Get all supervisors and their team leaders
  getAllSupervisorsAndTeamLeaders(): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(`${this.apiUrl}/Users/SupervisorsAndTeamLeaders`);
  }

  // Get all employees and their supervisors
  getAllEmployeesAndSupervisors(): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(`${this.apiUrl}/Users/EmployeesAndSupervisors`);
  }
  updateUser(id: string, user: UpdateUserDto): Observable<UserValidationResponse> {
    return this.http.put<UserValidationResponse>(`${this.apiUrl}/Users/UpdateUser/${id}`, user);
  }
  // Delete a user
  deleteUser(id: string): Observable<UserValidationResponse> {
    return this.http.delete<UserValidationResponse>(`${this.apiUrl}/Users/DeleteUser/${id}`);
  }
}


