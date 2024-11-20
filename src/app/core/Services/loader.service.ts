import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loaderRequestCount: number =0;
  constructor(private spinnerService:NgxSpinnerService) { }

  loader(){
    this.loaderRequestCount++;
    this.spinnerService.show(undefined,{
      type:"square-jelly-box",
      color:'blue',
      bdColor: "rgba(0,0,0,0.8)",
      size : "medium",
    })
  }
  hideLoader(){
      this.loaderRequestCount--;
      if(this.loaderRequestCount <=0){
        this.loaderRequestCount =0;
        this.spinnerService.hide();
      }
  }
}