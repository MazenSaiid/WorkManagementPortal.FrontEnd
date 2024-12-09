import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import {  AccountServiceValidationResponse, ValidationResponse } from '../Models/Responses/UserValidationResponse';
import { map, Observable, ReplaySubject } from 'rxjs';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
 
  private apiUrl = `${environment.apiUrl}/api`; // Adjust base URL if needed

  currentUser = new ReplaySubject<AccountServiceValidationResponse | null>(1);
  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient,private globals:Globals) { }

  // login
  login( loginDto: any): Observable<AccountServiceValidationResponse> {
    return this.http.post<AccountServiceValidationResponse>(`${this.apiUrl}/Accounts/Login`, loginDto).pipe(
      map(response => {
      if (response) { 
        const user: AccountServiceValidationResponse = {
          success: response.success,
          message: response.message,
          username: response.username,
          token: response.token,
          roles: response.roles,
          localSessionExpiryDate: response.localSessionExpiryDate
        };
        this.currentUser.next(user);
        this.globals.updateUserLoginFlag(true);
      } else {
        console.error('User object is not found in the response');
      }
      return response;
      })
    );
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
