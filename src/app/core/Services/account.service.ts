import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import {  ValidationResponse } from '../Models/Responses/UserValidationResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/api`; // Adjust base URL if needed

  constructor(private http: HttpClient) { }

  // login
  login( loginDto: any): Observable<ValidationResponse> {
    return this.http.post<ValidationResponse>(`${this.apiUrl}/Accounts/Login`, loginDto);
  }

   // get current user
   getCurrentUser(): Observable<ValidationResponse> {
    return this.http.get<ValidationResponse>(`${this.apiUrl}/Accounts/GetCurrentUser`);
  }

   // request password change 
   requestPasswordReset( email: any): Observable<ValidationResponse> {
    return this.http.post<ValidationResponse>(`${this.apiUrl}/Accounts/RequestPasswordReset`, email);
  }
}
