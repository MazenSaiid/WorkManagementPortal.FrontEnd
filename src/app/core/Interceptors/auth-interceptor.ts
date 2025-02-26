
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import { AccountService } from '../Services/account.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private globals: Globals, private router: Router,private accountService:AccountService, private toastr:ToastrService 
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // JWT token has expired, logout the user
          this.globals.clearSession();
          this.globals.currentUserInfo = null;
          this.globals.loggedIn = false;
          this.toastr.warning('You must be logged in to access this page. Please log in and try again.');
          this.router.navigate(['']);
        }
        return throwError(error);
      })
    );
  }
}
