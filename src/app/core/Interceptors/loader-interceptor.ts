import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, finalize } from 'rxjs';
import { LoaderService } from '../Services/loader.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor{
  
  constructor(private loaderService:LoaderService) {

  }
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.loader();
  return next.handle(req).pipe(
    delay(500),
    finalize(()=>{
      this.loaderService.hideLoader();
    })
  );
}
}