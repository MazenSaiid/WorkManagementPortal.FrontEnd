import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateRoleDto } from '../../core/Models/UpdateRoleDto';
import { RolesListDto } from '../../core/Models/RolesListDto';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl = `${environment.apiUrl}/api`; // Adjust base URL if needed

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<RolesListDto[]> {
    return this.http.get<RolesListDto[]>(`${this.apiUrl}/Role/GetAllRoles`);
  }
   // Create or update a role
   updateRole( role: UpdateRoleDto): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/Role/UpdateRole/`, role);
  }
  // Create or update a role
  createRole( user: any): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/Role/CreateRole/`, user);
  }

  // Delete a user
  deleteRole(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/Role/DeleteRole/${id}`);
  }
}
