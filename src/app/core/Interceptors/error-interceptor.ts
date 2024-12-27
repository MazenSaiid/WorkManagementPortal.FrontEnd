import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // Check if the error status is 400 (Bad Request)
        if (err.status === 400) {
          // Handle the validation response from the backend
          if (err.error && err.error.message) {
            // Here you can handle the error message returned from the backend
            return throwError(() => new Error(err.error.message));
          } else {
            return throwError(() => new Error('Bad Request. Please check your input.'));
          }
        }

        // Handle other HTTP status codes if needed
        if (err.status === 404) {
          this.router.navigateByUrl('not-found');
        } else if (err.status === 500) {
          // Optional: Navigate to a server error page with the error message
          const navigationExtras = { state: { error: err.error } };
          this.router.navigateByUrl('server-error', navigationExtras);
        }

        // Default error message for other errors
        return throwError(() => new Error(err.message || 'An unexpected error occurred.'));
      })
    );
  }
}
