import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import {  AccountServiceValidationResponse, ValidationResponse } from '../Models/Responses/UserValidationResponse';
import { map, Observable, ReplaySubject } from 'rxjs';
import { Globals } from '../globals';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
 
  private apiUrl = `${environment.apiUrl}/api`; // Adjust base URL if needed


  constructor(private http: HttpClient,private globals:Globals, private router:Router) { }

  createUser(user: any): Observable<ValidationResponse> {
    return this.http.post<ValidationResponse>(`${this.apiUrl}/Accounts/Register`, user)
  }
  createBulkUsers(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Accounts/UploadBulk`, formData); 
  }

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
        this.globals.storeUserInfo(user); // Save to localStorage and update Globals state
        console.log(user);
        this.router.navigate(['home']);
        this.globals.loggedIn = true;
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
    return this.http.post<ValidationResponse>(`${this.apiUrl}/Accounts/ForgotPassword`, email);
  }
}
