import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateRoleDto } from '../../core/Models/UpdateRoleDto';
import { RolesListDto } from '../../core/Models/RolesListDto';
import { RolesValidationResponse } from '../../core/Models/RolesValidationResponse';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl = `${environment.apiUrl}/api`; // Adjust base URL if needed

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<RolesValidationResponse> {
    return this.http.get<RolesValidationResponse>(`${this.apiUrl}/Role/GetAllRoles`);
  }

  // Get user count per role
  getUserCountPerRole(): Observable<RolesValidationResponse> {
    return this.http.get<RolesValidationResponse>(`${this.apiUrl}/Role/GetUserCountPerRole`);
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
