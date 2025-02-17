import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs'; // Assuming you have your environment defined
import { environment } from '../../environment/environment';
import {
  CountValidationResponse,
  UserValidationPaginatedResponse,
  UserValidationResponse,
  ValidationResponse,
} from '../../core/Models/Responses/UserValidationResponse';
import { UpdateUserDto } from '../../core/Models/Dtos/UpdateUserDto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api`; // Adjust base URL if needed

  constructor(private http: HttpClient) {}
  createUser(user: any): Observable<ValidationResponse> {
    return this.http.post<ValidationResponse>(
      `${this.apiUrl}/Accounts/Register`,
      user
    );
  }
  createBulkUsers(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Accounts/UploadBulk`, formData);
  }
  // Get all users
  getAllUsers(): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(
      `${this.apiUrl}/Users/GetAllUsers`
    );
  }
  getAllUsersCount(): Observable<CountValidationResponse> {
    return this.http.get<CountValidationResponse>(
      `${this.apiUrl}/Users/GetAllUsersCount`
    );
  }
  getUsersByRolePaginated(selectedFilter: string, page: number, itemsPerPage: number, fetchAll:boolean = false): Observable<UserValidationPaginatedResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', itemsPerPage.toString())
      .set('fetchAll', fetchAll.toString());
      
      return this.http.get<UserValidationPaginatedResponse>(
        `${this.apiUrl}/Users/GetUsersByRole?role=${selectedFilter}`,
        { params }
      );
  }
  getAllUsersPaginated(
    page: number = 1,
    pageSize: number = 20,
    fetchAll: boolean = false
  ): Observable<UserValidationPaginatedResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('fetchAll', fetchAll.toString());

    return this.http.get<UserValidationPaginatedResponse>(
      `${this.apiUrl}/Users/GetAllUsers`,
      { params }
    );
  }
  getAllAbsentUsers(date: string): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(
      `${this.apiUrl}/Users/AbsentUsers?date=${date}`
    );
  }
  getAllAbsentUsersPaginated(
    date: string,
    page: number = 1,
    pageSize: number = 20,
    fetchAll: boolean = false
  ): Observable<UserValidationPaginatedResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('fetchAll', fetchAll.toString());
    return this.http.get<UserValidationPaginatedResponse>(
      `${this.apiUrl}/Users/AbsentUsers?date=${date}`,
      { params }
    );
  }
  // Get all users Included Supervisors And TeamLeads
  getAllEmployeesWithSupervisorsAndTeamLeads(): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(
      `${this.apiUrl}/Users/EmployeesWithSupervisorsAndTeamLeads`
    );
  }
  getUserById(id: string): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(
      `${this.apiUrl}/Users/GetUserById/${id}`
    );
  }
  getAllSupervisors(): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(
      `${this.apiUrl}/Users/Supervisors`
    );
  }
  getAllSupervisorsPaginated(
    page: number = 1,
    pageSize: number = 20,
    fetchAll: boolean = false
  ): Observable<UserValidationPaginatedResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('fetchAll', fetchAll.toString());

    return this.http.get<UserValidationPaginatedResponse>(
      `${this.apiUrl}/Users/Supervisors`,
      { params }
    );
  }
  // Get all team leaders
  getAllTeamLeaders(): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(
      `${this.apiUrl}/Users/TeamLeaders`
    );
  }
  getAllTeamLeadersPaginated(
    page: number = 1,
    pageSize: number = 20,
    fetchAll: boolean = false
  ): Observable<UserValidationPaginatedResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('fetchAll', fetchAll.toString());

    return this.http.get<UserValidationPaginatedResponse>(
      `${this.apiUrl}/Users/TeamLeaders`,
      { params }
    );
  }

  // Get all employees
  getAllEmployees(): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(
      `${this.apiUrl}/Users/Employees`
    );
  }
  getAllEmployeesPaginated(
    page: number = 1,
    pageSize: number = 20,
    fetchAll: boolean = false
  ): Observable<UserValidationPaginatedResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('fetchAll', fetchAll.toString());

    return this.http.get<UserValidationPaginatedResponse>(
      `${this.apiUrl}/Users/Employees`,
      { params }
    );
  }
  // Get all supervisors and their team leaders
  getAllSupervisorsAndTeamLeaders(): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(
      `${this.apiUrl}/Users/SupervisorsAndTeamLeaders`
    );
  }

  // Get all employees and their supervisors
  getAllEmployeesAndSupervisors(): Observable<UserValidationResponse> {
    return this.http.get<UserValidationResponse>(
      `${this.apiUrl}/Users/EmployeesAndSupervisors`
    );
  }
  updateUser(
    id: string,
    user: UpdateUserDto
  ): Observable<UserValidationResponse> {
    return this.http.put<UserValidationResponse>(
      `${this.apiUrl}/Users/UpdateUser/${id}`,
      user
    );
  }
  // Delete a user
  deleteUser(id: string): Observable<UserValidationResponse> {
    return this.http.delete<UserValidationResponse>(
      `${this.apiUrl}/Users/DeleteUser/${id}`
    );
  }
}
