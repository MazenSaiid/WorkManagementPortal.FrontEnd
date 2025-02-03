import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateRoleDto } from '../../core/Models/Dtos/UpdateRoleDto';
import { RolesListDto } from '../../core/Models/Dtos/RolesListDto';
import { RolesValidationPaginatedResponse, RolesValidationResponse } from '../../core/Models/Responses/RolesValidationResponse';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl = `${environment.apiUrl}/api`; // Adjust base URL if needed

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<RolesValidationResponse> {
    return this.http.get<RolesValidationResponse>(`${this.apiUrl}/Role/GetAllRoles`);
  }
  getAllRolesPaginated(page: number = 1, pageSize: number = 20, fetchAll: boolean = false) : Observable<RolesValidationPaginatedResponse> {
    const params = new HttpParams()
          .set('page', page.toString())
          .set('pageSize', pageSize.toString())
          .set('fetchAll', fetchAll.toString());
          return this.http.get<RolesValidationPaginatedResponse>(`${this.apiUrl}/Role/GetAllRoles`, { params });
  }
  getUserCountPerRole(): Observable<RolesValidationResponse> {
    return this.http.get<RolesValidationResponse>(`${this.apiUrl}/Role/GetUserCountPerRole`);
  }
  getUserCountPerRolePaginated(page: number = 1, pageSize: number = 20, fetchAll: boolean = false) : Observable<RolesValidationPaginatedResponse> {
    const params = new HttpParams()
          .set('page', page.toString())
          .set('pageSize', pageSize.toString())
          .set('fetchAll', fetchAll.toString());
          return this.http.get<RolesValidationPaginatedResponse>(`${this.apiUrl}/Role/GetUserCountPerRole`, { params });
  }
   // Create or update a role
   updateRole( role: UpdateRoleDto):Observable<RolesValidationResponse> {
    return this.http.put<RolesValidationResponse>(`${this.apiUrl}/Role/UpdateRole/`, role);
  }
  // Create or update a role
  createRole( roleName: any): Observable<RolesValidationResponse> {
    return this.http.post<RolesValidationResponse>(`${this.apiUrl}/Role/CreateRole/`, roleName);
  }
  // Delete a user
  deleteRole(id: string): Observable<RolesValidationResponse> {
    return this.http.delete<RolesValidationResponse>(`${this.apiUrl}/Role/DeleteRole/${id}`);
  }
}
