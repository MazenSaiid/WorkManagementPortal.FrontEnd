
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Globals } from '../globals';
//import { AccountService } from './account/Services/account.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private globals: Globals, private router: Router,//private accountService:AccountService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // JWT token has expired, logout the user
          this.globals.clearSession();
          //this.accountService.currentUser.next(null);
          this.globals.loggedIn = false;
          this.router.navigate(['/account/login']);
        }
        return throwError(error);
      })
    );
  }
}
